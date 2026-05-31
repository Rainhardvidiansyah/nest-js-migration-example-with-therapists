import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { comparePassword } from '../utils/password.encoder';
import { LoginDto } from './dto/login.dto';
import { RegisterLocalDto } from './dto/register-local.dto';
import { RedisConfigService } from 'src/redisconfig/redisconfig.service';
import { RedisCacheKey } from 'src/common/constants/redis-cache-key.constant';
import { RedisTTL } from 'src/common/constants/redis-ttl.constants';




@Injectable()
export class AuthService {



  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly userService: UsersService,
    private readonly redisService: RedisConfigService
  ){}


  async createLocalUser(registerLocalDto: RegisterLocalDto) {
    return this.userService.createLocalUser({email: registerLocalDto.email, password: registerLocalDto.password});
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

    await this.redisService.set(
      RedisCacheKey.REFRESH_TOKEN(user.id), 
      generatedRefreshToken.refresh_token,
      RedisTTL.REFRESH_TOKEN);

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

      

      const storedRefreshToken = await this.redisService.get<string>(RedisCacheKey.REFRESH_TOKEN(sub));

    
      if(!storedRefreshToken || storedRefreshToken !== refreshToken){
        throw new UnauthorizedException('Invalid token');
      }

      return {sub, email, roles};
    
    }catch(error){
      this.logger.error("Invalid refresh token", error);
      throw new UnauthorizedException("Invalid refresh token");
    }
  }

  async logoutUser(refreshToken: string): Promise<void>{

    try {
      const decodedRefreshToken = await this.jwtService.verify(refreshToken,
        {
          secret: this.configService.get<string>("REFRESH_TOKEN_SECRET"),
        }
      );

      const sub = decodedRefreshToken.sub;

      await this.redisService.delete(RedisCacheKey.REFRESH_TOKEN(sub));

    } catch (error) {
      throw new UnauthorizedException("Invalid refresh token");
    }
  }
 
}

//TODO: Implement refresh token logic,
// store refresh tokens in database (?), 
// and implement token revocation logic