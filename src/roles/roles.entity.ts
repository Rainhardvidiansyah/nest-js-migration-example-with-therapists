import {
  Entity,
  Column,
  PrimaryColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  Index,
  ManyToMany,
} from 'typeorm';
import { UsersEntity } from '../users/users.entity';

@Entity('roles')
export class RolesEntity {

  @PrimaryColumn('uuid')
  id!: string;

  @Index({ unique: true })
  @Column({
    name: 'role_name',
    type: 'varchar',
    length: 255,
  })
  roleName!: string;

  @Column({
    name: 'description',
    type: 'text',
    nullable: true,
  })
  description?: string;

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamp',
    default: () => 'now()',
  })
  createdAt!: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamp',
    default: () => 'now()',
  })
  updatedAt!: Date;

  @DeleteDateColumn({
    name: 'deleted_at',
    type: 'timestamp',
    nullable: true,
  })
  deletedAt?: Date;


  @ManyToMany(() => UsersEntity, (user) => user.roles)
  users!: UsersEntity[];
}