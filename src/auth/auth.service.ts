import { ConflictException, Injectable, Logger, UnauthorizedException } from '@nestjs/common';

import { UsersService } from '../users/users.service';
import { comparePassword } from '../utils/password.encoder';
import { LoginDto } from './dto/login.dto';
import { RegisterLocalDto } from './dto/register-local.dto';
import { UserRegistrationProducer } from 'src/queue/producers/user-registration.producer';
import { TokenService } from './token.service';




@Injectable()
export class AuthService {



  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly tokenService: TokenService,
    private readonly userService: UsersService,
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

    this.logger.log(loginDto)

    const { email, password } = loginDto;
    
    const user = await this.userService.findByEmail(email);

    this.logger.log(user);

    const isPasswordValid = await comparePassword(password, user.password);
    
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    let roles = user.roles.map(roles => roles.roleName);

    const generatedToken = await this.tokenService.generateToken(user.id, user.email, roles);
    console.log(`===generated token: `, generatedToken);


    const generatedRefreshToken = await this.tokenService.generateRefreshToken(user.id, user.email, roles);

    return {
      id: user.id,
      email: user.email,
      roles: roles,
      access_token: generatedToken.access_token,
      refresh_token: generatedRefreshToken.refresh_token,
    };
  }

  async logOutUser(refreshToken: string){
    await this.tokenService.logoutUser(refreshToken);
  }

  async validateRefreshToken(refreshToken: string){
    const decoded =  this.tokenService.validateRefreshToken(refreshToken);
    return decoded;
  }

  async generateNewToken(id: string, email: string, roles: string[]){
    const payload = { sub: id, email: email, roles: roles };
    const newToken = await this.tokenService.generateToken(payload.sub, payload.email, payload.roles);

    return newToken;
  }

  //TODO: IMPLEMENT FORGET PASSWORD LOGIC

 
}

//TODO: Implement refresh token logic,
// store refresh tokens in database (?), 
// and implement token revocation logic