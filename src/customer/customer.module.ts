import { Module } from '@nestjs/common';
import { CustomerService } from './customer.service';
import { CustomerController } from './customer.controller';
import { DatabaseModule } from 'src/database/database.module';
import { customerProviders } from './customer.providers';

@Module({
  imports: [DatabaseModule],
  exports: [CustomerService],
  providers: [CustomerService, ...customerProviders],
  controllers: [CustomerController]
})
export class CustomerModule {}
