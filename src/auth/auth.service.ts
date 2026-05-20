/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable prettier/prettier */
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { JwtService } from '@nestjs/jwt';
import { UsersEntity } from 'src/users/users.entity';
import { UsersService } from 'src/users/users.service';
import { comparePassword } from 'src/utils/password.encoder';

@Injectable()
export class AuthService {


  constructor(private usersService: UsersService, private jwtService: JwtService, private configService: ConfigService) {}


  //LOGIN USER METHOD
  async login(email: string, password: string) {
    const user = await this.validateUser(email, password);
    const token = this.generateToken(user);
    return token;
  }

  //VALIDATE USER DURING SIGN IN
  private async validateUser(email: string, password: string): Promise<UsersEntity> {

    const user = await this.usersService.findUserByEmail(email, password);

    const isPasswordMatching = await comparePassword(password, user.password);

    if (!isPasswordMatching) {
      throw new UnauthorizedException('Invalid credentials');
    }
      
    return user;
  }



  //GENERATE JWT TOKEN AFTER SIGN IN
  private async generateToken(user: UsersEntity): Promise<{ access_token: string }> {
    
    const payload = { sub: user.id, email: user.email };
    const generatedToken = await this.jwtService.signAsync(payload, {
      secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
      expiresIn: this.configService.get<number>('JWT_ACCESS_EXPIRES_IN'),
    })

    return {access_token: generatedToken};
  }

  
}

