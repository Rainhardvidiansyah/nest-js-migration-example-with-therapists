import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule, JwtModuleOptions } from '@nestjs/jwt';
import { UsersModule } from '../users/users.module';
import { DatabaseModule } from '../database/database.module';

import { APP_GUARD } from '@nestjs/core';
import { RedisConfigModule } from 'src/redisconfig/redis-config.module';
import { QueueModule } from 'src/queue/queue.module';
import { TokenService } from './token.service';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';

@Module({
  imports: [
    UsersModule,
    DatabaseModule,
    RedisConfigModule,
    QueueModule,


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
  providers: [
    AuthService, 
    {
      provide: APP_GUARD, 
      useClass: AuthGuard
    },
       {
      provide: APP_GUARD,
      useClass: RolesGuard
    },
    TokenService
  ],
  controllers: [AuthController],
})
export class AuthModule {}
