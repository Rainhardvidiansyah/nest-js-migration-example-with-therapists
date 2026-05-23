import { Module } from '@nestjs/common';
import { RolesService } from './roles.service';
import { rolesProviders } from './role.providers';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule],
  
  providers: [RolesService, ...rolesProviders],
  exports: [RolesService],
})
export class RolesModule {}
