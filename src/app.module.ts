import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TherapistsModule } from './therapists/therapists.module';
import { DatabaseModule } from './database/database.module';
import { RolesModule } from './roles/roles.module';
import { ProductsModule } from './products/products.module';
import { RedisConfigModule } from './redisconfig/redis-config.module';
import { ThrottlerModule } from '@nestjs/throttler';
import { ThrottlerStorageRedisService } from '@nest-lab/throttler-storage-redis';
import { EmailModule } from './email/email.module';
import { QueueModule } from './queue/queue.module';
import { CustomerModule } from './customer/customer.module';


@Module({
  imports: [
    DatabaseModule, AuthModule, 
    UsersModule, TherapistsModule,
    RolesModule, ProductsModule, RedisConfigModule,

    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        throttlers: [{
          name: 'login',
          ttl: 60000,
          limit: 5,
        }],
        storage: new ThrottlerStorageRedisService({
          host: configService.get<string>('REDIS_HOST'),
          port: configService.get<number>('REDIS_PORT'),
        }),
      }),
    }),
    
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [
        `.env.${process.env.NODE_ENV || 'development'}`,
        '.env'
      ],
      ignoreEnvFile: false,
    }),

    EmailModule,

    QueueModule,

    CustomerModule,
  ],
  providers: [],

  
})


export class AppModule {}
