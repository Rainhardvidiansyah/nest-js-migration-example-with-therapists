import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Logger, Post, Req, Res, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { Public } from '../common/decorators/public.decorators';
import { RegisterLocalDto } from './dto/register-local.dto';
import { ResponseMessage } from '../common/decorators/response-message.decorators';
import { LoginResponseDto } from './dto/login-response.dto';
import { GenerateNewTokenResponse } from './dto/generate-new-token-response.dto';
import { Throttle } from '@nestjs/throttler';
import { Roles } from 'src/common/decorators/roles.decorators';
import { Role } from 'src/common/enums/role.enum';


@Controller('auth')
// @UseInterceptors(ClassSerializerInterceptor)
export class AuthController {

  //Following the JWT best practices, I used "sub" as property instead of "id" in the payload. In regarding to JWT things, I will keep using sub in payload, but in the response, I will use id to make it more intuitive for the frontend.

  private readonly logger = new Logger(AuthController.name);

  constructor(private readonly authService: AuthService) {}


  @ResponseMessage('User registered successfully')
  @HttpCode(HttpStatus.ACCEPTED)
  @Public()
  @Post('register/local')
  async registerLocal(@Body() registerLocalDto: RegisterLocalDto) {

    await this.authService.createLocalUser(registerLocalDto);
  }

  
  @Public()
  @ResponseMessage('Login success')
  @Throttle({ login: { limit: 5, ttl: 60000 } })
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto, @Res({passthrough: true}) res) {

    const userData = await this.authService.validateUser(loginDto);

    res.cookie('refresh_token', userData.refresh_token, {
      httpOnly: true,
      secure: false,
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // a week in milliseconds. In development, try to set it to a shorter time for testing purposes.
    });

    return new LoginResponseDto(userData)
  }


  @Public()
  @ResponseMessage('Token refreshed successfully')
  @Get('refresh')
  @HttpCode(HttpStatus.OK)
  async generateNewToken(@Req() req, @Res({ passthrough: true }) res) {
    
    const refreshToken = req.cookies?.refresh_token;

    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token not found');
    }

    const validatedToken = await this.authService.validateRefreshToken(refreshToken);

    const payload = {
      id: validatedToken.sub,
      email: validatedToken.email,
      roles: validatedToken.roles, 
    };

    const newAccessToken = await this.authService.generateNewToken(
      payload.id,
      payload.email,
      payload.roles,
    );

    return new GenerateNewTokenResponse(payload, newAccessToken.access_token)
  }
  
  

  @Get('profile')
  @Roles(Role.ADMIN)
  @HttpCode(HttpStatus.OK)
  async profile(@Req() req) {
    const user = req.user; //Assuming the user information is attached to the request object by an authentication middleware
    return {
      message: 'Profile information',
      user: {
        id: user.sub,
        email: user.email,
        roles: user.roles,
      },
    };
  }

  //LOGOUT
  //DO NOT FORGET TO PASS THE ACCESS TOKEN TO USE THIS ENDPOINT.
  @ResponseMessage('Logout successful')
  @Delete('logout')
  @HttpCode(HttpStatus.OK)
  async logOut(@Res({ passthrough: true }) res, @Req() req){
    
    const refreshToken = req.cookies?.refresh_token;
    
    if(!refreshToken){
      throw new UnauthorizedException('Invalid refresh token');
    }

    await this.authService.logOutUser(refreshToken);

    res.clearCookie('refresh_token', {
      httpOnly: true,
      secure: false, 
      sameSite: 'strict',
    });
  }

}
