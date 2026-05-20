/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
// import { DatabaseModule } from './database/database.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TherapistsModule } from './therapists/therapists.module';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [
    DatabaseModule, 
    AuthModule, UsersModule,

    ConfigModule.forRoot({ 
        isGlobal: true,
        envFilePath: [
          `.env.${process.env.NODE_ENV || 'development'}`,
          '.env.local',
          '.env',
        ],
        ignoreEnvFile: false,
      }),

    TherapistsModule,
  ],

  
})


export class AppModule {}
