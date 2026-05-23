import { Body, Controller, Get, HttpStatus, Logger, Post, Req, Res, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { Public } from '../common/decorators/public-decorators';


@Controller('auth')
export class AuthController {

  //Following the JWT best practices, I used "sub" as property instead of "id" in the payload. In regarding to JWT things, I will keep using sub in payload, but in the response, I will use id to make it more intuitive for the frontend.

  private readonly logger = new Logger(AuthController.name);


  constructor(private authService: AuthService) {}



  @Public()
  @Post('login')
  async login(@Body() loginDto: LoginDto, @Res({passthrough: true}) res) {

    const data = await this.authService.validateUser(loginDto);

    res.cookie('refresh_token', data.refresh_token, {
      httpOnly: true,
      secure: false,
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // a week in milliseconds. In development, try to set it to a shorter time for testing purposes.
    });


    return {
      message: 'Login successful',
      httpStatus: 200,
      userData: {
        id: data.id,
        email: data.email,
        roles: data.roles
      },
      access_token: data.access_token
    };
  }


  @Public()
  @Post('refresh')
  async generateNewToken(@Req() req, @Res({ passthrough: true }) res) {
    
    const refreshToken = req.cookies?.refresh_token;


    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token not found');
    }

    const validatedToken = await this.authService.validateRefreshToken(refreshToken);

    const payload = {
      sub: validatedToken.sub,
      email: validatedToken.email,
      roles: validatedToken.roles, 
    };

    const newAccessToken = await this.authService.generateToken(
      payload.sub,
      payload.email,
      payload.roles,
    );

    return {
      message: 'Token refreshed successfully',
      httpStatus: 200,
      userData: {
        id: payload.sub,
        email: payload.email,
        roles: payload.roles,
      },
      new_access_token: newAccessToken.access_token,
    };
  }
  
  

  @Get('profile')
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

  //TODO: LOGOUT ENDPOINT, invalidate refresh token, and implement token revocation logic.

}
