import { Body, Controller, Get, Logger, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';


@Controller('auth')
export class AuthController {

  private readonly logger = new Logger(AuthController.name);
  constructor(private authService: AuthService) {}


  //TODO: Implement login endpoint, validate user credentials, and return JWT token.


  @Get()
  async sayHey(){
    this.logger.log('Hey there! endpoint is working!');
    return 'Hey there!';
  }


  @Post('login')
  async login(@Body() loginDto: LoginDto) {

    this.logger.log('Login attempt with email:', loginDto.email);

    
    const { email, password } = loginDto;
    return this.authService.validateUser(email, password);
  }
  
  
  
  
  
  
  
  
  
  
  //TODO: LOGOUT ENDPOINT, invalidate refresh token, and implement token revocation logic.

}
