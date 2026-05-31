import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import { TherapistsModule } from './therapists/therapists.module';
import { DatabaseModule } from './database/database.module';
import { RolesModule } from './roles/roles.module';
import { ProductsModule } from './products/products.module';
import { RedisConfigModule } from './redisconfig/redis-config.module';


@Module({
  imports: [
    DatabaseModule, AuthModule, 
    UsersModule, TherapistsModule,
    RolesModule, ProductsModule, RedisConfigModule,

    ConfigModule.forRoot({ 
        isGlobal: true,
        envFilePath: [
          `.env.${process.env.NODE_ENV || 'development'}`,
          '.env.local',
          '.env',
        ],
        ignoreEnvFile: false,
      }),

   

    

    
  ],

  
})


export class AppModule {}
