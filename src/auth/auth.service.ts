import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { comparePassword } from '../utils/password.encoder';
import { UsersEntity } from '../users/users.entity';




@Injectable()
export class AuthService {



  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly userService: UsersService
  ){}



  async validateUser(email: string, password: string): Promise<UsersEntity> {

    const user = await this.userService.findByEmail(email);

    const isPasswordValid = await comparePassword(password, user.password);
    
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    return user;
  }


  //GENERATE ACCESS TOKEN
  async generateToken(id: string, email: string, role: string[]): Promise<{access_token: string}> {

    const payload = { sub: email, id: id, role: role };


    const generatedToken = await this.jwtService.signAsync(payload, {
      secret: this.configService.get<string>('JWT_SECRET'),
      expiresIn: this.configService.get<number>('JWT_TOKEN_EXPIRES_IN'),
    });
    
    return {
      access_token: generatedToken,
    }; 
  }



  //GENERATE REFRESH TOKEN
  async refreshToken(id: string, email: string, role: string[]): Promise<{access_token: string}> {

    const payload = { sub: email, id: id, role: role };

    const generatedRefreshToken = await this.jwtService.signAsync(payload, {
      secret: this.configService.get<string>('REFRESH_TOKEN_SECRET'),
      expiresIn: this.configService.get<number>('REFRESH_TOKEN_EXPIRES_IN'),
    });

    return {
      access_token: generatedRefreshToken,
    }
  }




  //VERIFY TOKEN
  async decodeToken(token: string): Promise<{ sub: number; email: string, roles: string[] }> {
    try{
      const decodedToken = await this.jwtService.verify(token,
        {
          secret: this.configService.get<string>("REFRESH_TOKEN_SECRET"),
        }
      )
      const {sub, email, roles} = decodedToken;
      
      this.logger.warn(`DECODED TOKEN METHOD [SUB] - AUTH SERVICE CLASS: ${sub}`);
      this.logger.log(`DECODED TOKEN METHOD [EMAIL]: ${email}`);
      this.logger.log(`DECODED TOKEN METHOD [ROLES]: ${roles}`);
      
      return {sub, email, roles};
    
    }catch(error){
      this.logger.error("Invalid refresh token", error);
      
      throw new UnauthorizedException("Invalid refresh token");
    }
  }



}

//TODO: Implement refresh token logic,
// store refresh tokens in database, 
// and implement token revocation logic.