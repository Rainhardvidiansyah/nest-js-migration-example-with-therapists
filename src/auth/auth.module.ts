/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from 'src/users/users.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule, JwtModuleOptions } from '@nestjs/jwt';

@Module({
  imports: [
    UsersModule,
    
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService): JwtModuleOptions => ({
        secret: configService.get<string>("JWT_ACCESS_SECRET"),
        signOptions: { 
          expiresIn: configService.get<number>('JWT_ACCESS_EXPIRES_IN') 
        },
      }),
    }),
    
  ],
  providers: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
