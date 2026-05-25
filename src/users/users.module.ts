import { Module } from '@nestjs/common';
import { UsersService } from './users.service';

import { usersProviders } from './users.providers';
import { UsersController } from './users.controller';
import { DatabaseModule } from '../database/database.module';
import { RolesModule } from '../roles/roles.module';

@Module({
  imports: [DatabaseModule, RolesModule],
  providers: [UsersService, ...usersProviders],
  exports: [UsersService],
  controllers: [UsersController],
})
export class UsersModule {}
