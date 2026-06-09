import { ConflictException, Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { comparePassword } from '../utils/password.encoder';
import { LoginDto } from './dto/login.dto';
import { RegisterLocalDto } from './dto/register-local.dto';
import { RedisConfigService } from 'src/redisconfig/redisconfig.service';
import { RedisCacheKey } from 'src/common/constants/redis-cache-key.constant';
import { RedisTTL } from 'src/common/constants/redis-ttl.constants';
import { UserRegistrationProducer } from 'src/queue/producers/user-registration.producer';




@Injectable()
export class AuthService {



  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly userService: UsersService,
    private readonly redisService: RedisConfigService,
    private readonly registrationQueue: UserRegistrationProducer
  ){}



  //REGISTER USER LOCAL -> EMAIL AND PASSWORD ONLY
  async createLocalUser(registerLocalDto: RegisterLocalDto) {
    
    const isEmailExisting = await this.userService.getUserByEmail(registerLocalDto.email);
    
    if(isEmailExisting){
        throw new ConflictException('Email already exists');
    }
    
    await this.registrationQueue.addUserRegistrationJob({email: registerLocalDto.email, password: registerLocalDto.password});
    
  }

  //VALIDATE USER
  async validateUser(loginDto: LoginDto){

    const { email, password } = loginDto;
    
    const user = await this.userService.findByEmail(email);

    const isPasswordValid = await comparePassword(password, user.password);
    
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    let roles = user.roles.map(roles => roles.roleName);

    const generatedToken = await this.generateToken(user.id, user.email, roles);

    const generatedRefreshToken = await this.generateRefreshToken(user.id, user.email, roles);

    this.setRefreshToken(user.id, generatedRefreshToken.refresh_token);

    return {
      id: user.id,
      email: user.email,
      roles: roles,
      access_token: generatedToken.access_token,
      refresh_token: generatedRefreshToken.refresh_token,
    };
  }


  //GENERATE ACCESS TOKEN
  async generateToken(id: string, email: string, roles: string[]): Promise<{access_token: string}> {

    const payload = { sub: id, email: email, roles: roles };

    const generatedToken = await this.jwtService.signAsync(payload, {
      secret: this.configService.get<string>('JWT_SECRET'),
      expiresIn: this.configService.get<number>('JWT_TOKEN_EXPIRES_IN'),
    });
    
    return {
      access_token: generatedToken,
    };
  }



  //GENERATE REFRESH TOKEN
  private async generateRefreshToken(id: string, email: string, roles: string[]): Promise<{refresh_token: string}> {

    const payload = {sub: id, email: email, roles: roles};

    const generatedRefreshToken = await this.jwtService.signAsync(payload, {
      secret: this.configService.get<string>('REFRESH_TOKEN_SECRET'),
      expiresIn: this.configService.get<number>('REFRESH_TOKEN_EXPIRES_IN'),
    });

    return {
      refresh_token: generatedRefreshToken,
    };
  }




  //VERIFY TOKEN
  async validateRefreshToken(refreshToken: string) {

    if (!refreshToken) {
      throw new UnauthorizedException('Token not found or invalid format');
    }

    try{
      const decodedRefreshToken = await this.jwtService.verify(refreshToken,
        {
          secret: this.configService.get<string>("REFRESH_TOKEN_SECRET"),
        }
      );

      const {sub, email, roles} = decodedRefreshToken;
      
      
      this.logger.log(`content of decoded refresh token: ${JSON.stringify(decodedRefreshToken)} - in validateRefreshToken method`);

      const userId = sub;
      await this.getRefreshTokenFromRedis(userId, refreshToken);

      
      return {sub, email, roles};
    
    }catch(error){
      this.logger.error("Invalid refresh token", error);
      throw new UnauthorizedException("Invalid refresh token");
    }
  }


  //LOGOUT USER
  async logoutUser(refreshToken: string): Promise<void>{

    try {
      const decodedRefreshToken = await this.jwtService.verify(refreshToken,
        {
          secret: this.configService.get<string>("REFRESH_TOKEN_SECRET"),
        }
      );

      const userId = decodedRefreshToken.sub;

      await this.deleteRefreshTokenFromRedis(userId);
      

    } catch (error) {
      throw new UnauthorizedException("Invalid refresh token hahahaha");
    }
  }


  //SET REFRESH TOKEN TO REDIS ==> LOGIN
  private async setRefreshToken(userId: string, refreshToken: string){
    await this.redisService.set(
      RedisCacheKey.REFRESH_TOKEN(userId), 
      refreshToken,
      RedisTTL.REFRESH_TOKEN);
  }

  //DELETE REFRESH TOKEN AND USER ID FROM REDIS ==> LOGOUT
  private async deleteRefreshTokenFromRedis(userId: string){
    await this.redisService.delete(RedisCacheKey.REFRESH_TOKEN(userId));
  }

  // GET REFRESH TOKEN FROM REDIS ==> VALIDATE REFRESH TOKEN
  private async getRefreshTokenFromRedis(userId: string, refreshToken: string){
    const storedRefreshToken = await this.redisService.get<string>(RedisCacheKey.REFRESH_TOKEN(userId));
    
      if(!storedRefreshToken || storedRefreshToken !== refreshToken){
        throw new UnauthorizedException('Invalid token');
      }
  }

  //TODO: IMPLEMENT FORGET PASSWORD LOGIC

 
}

//TODO: Implement refresh token logic,
// store refresh tokens in database (?), 
// and implement token revocation logic