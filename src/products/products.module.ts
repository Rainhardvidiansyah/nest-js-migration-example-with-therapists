import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { DatabaseModule } from 'src/database/database.module';
import { productProviders } from './product.providers';
import { RedisConfigModule } from 'src/redisconfig/redis-config.module';


@Module({

  imports: [DatabaseModule, RedisConfigModule],
 
  providers: [ProductsService, ...productProviders],

  controllers: [ProductsController]
})
export class ProductsModule {}
