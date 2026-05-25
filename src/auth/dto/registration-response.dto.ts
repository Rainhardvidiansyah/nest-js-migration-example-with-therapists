import { Expose} from 'class-transformer';
import { UsersEntity } from '../../users/users.entity';

export class RegisterResponseDto {
  @Expose()
  id: string;

  @Expose()
  email: string;

  @Expose()
  roles: string[];

  constructor(user: Partial<UsersEntity>) {
    this.id = user.id!;
    this.email = user.email!;
    this.roles = user.roles ? user.roles.map(role => role.roleName) : [];
  }

  
    
}