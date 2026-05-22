/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule, JwtModuleOptions } from '@nestjs/jwt';
import { UsersModule } from '../users/users.module';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [
    UsersModule,
    DatabaseModule,
    
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService): JwtModuleOptions => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { 
          expiresIn: configService.get<number>('JWT_TOKEN_EXPIRES_IN') 
        },
      }),
    }),
    
  ],
  providers: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
