import { Module } from '@nestjs/common';
import { UsersService } from './users.service';

import { usersProviders } from './users.providers';
import { UsersController } from './users.controller';
import { DatabaseModule } from '../database/database.module';
import { RolesModule } from '../roles/roles.module';
import { CustomerModule } from 'src/customer/customer.module';

@Module({
  imports: [DatabaseModule, RolesModule, CustomerModule],
  providers: [UsersService, ...usersProviders],
  exports: [UsersService],
  controllers: [UsersController],
})
export class UsersModule {}
