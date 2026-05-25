import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { RolesEntity } from './roles.entity';

@Injectable()
export class RolesService {


  constructor(
    @Inject('ROLES_REPOSITORY') private readonly rolesRepository: Repository<RolesEntity>,
    @Inject('DATA_SOURCE') private readonly dataSource: DataSource)
    {}
    
    async findRoleByRoleName(roleName: string): Promise<RolesEntity>{

      const role = await this.rolesRepository.findOne({where: {roleName}});

      if(role === null){
        throw new NotFoundException('Role not found');
      }
      
      return role;
  }

}
