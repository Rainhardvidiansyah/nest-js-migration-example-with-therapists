import { Injectable, Logger, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { RedisCacheKey } from "src/common/constants/redis-cache-key.constant";
import { RedisTTL } from "src/common/constants/redis-ttl.constants";
import { RedisConfigService } from "src/redisconfig/redisconfig.service";


@Injectable()
export class TokenService{

  private logger = new Logger(TokenService.name);


  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly redisService: RedisConfigService
  ){}


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
  async generateRefreshToken(id: string, email: string, roles: string[]): Promise<{refresh_token: string}> {

    const payload = {sub: id, email: email, roles: roles};

    const generatedRefreshToken = await this.jwtService.signAsync(payload, {
      secret: this.configService.get<string>('REFRESH_TOKEN_SECRET'),
      expiresIn: this.configService.get<number>('REFRESH_TOKEN_EXPIRES_IN'),
    });

    await this.setRefreshToken(id, generatedRefreshToken);

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
      const decodedRefreshToken = await this.jwtService.verifyAsync(refreshToken,
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


  async logoutUser(refreshToken: string): Promise<void>{

    try {
      const decodedRefreshToken = await this.jwtService.verifyAsync(refreshToken,
        {
          secret: this.configService.get<string>("REFRESH_TOKEN_SECRET"),
        }
      );

      const userId = decodedRefreshToken.sub;

      await this.deleteRefreshTokenFromRedis(userId);

    } catch (error) {
      throw new UnauthorizedException("Invalid refresh token when user logout");
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
}