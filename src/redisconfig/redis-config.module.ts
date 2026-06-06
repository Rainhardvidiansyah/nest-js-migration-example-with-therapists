import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { RedisConfigService } from './redisconfig.service';
import KeyvRedis from '@keyv/redis';
import { RedisPubSubService } from './redis-pubsub.service';



@Module({

  imports: [

  CacheModule.registerAsync({
    isGlobal: true,
    imports: [ConfigModule],
    useFactory: async (configService: ConfigService) => {
    const host = configService.get<string>('REDIS_HOST');
    const port = configService.get<number>('REDIS_PORT');

  return {
    stores: [
      new KeyvRedis(`redis://${host}:${port}?commandTimeout=1000`, {
        connectionTimeout: 3000,
        throwOnConnectError: false,
        throwOnErrors: false
      })
 
    ]
  };
},
  inject: [ConfigService],
}),

],

exports: [ 
  RedisConfigService, CacheModule, RedisPubSubService],
  
providers: [
 RedisPubSubService, RedisConfigService],
 
})


export class RedisConfigModule {}
