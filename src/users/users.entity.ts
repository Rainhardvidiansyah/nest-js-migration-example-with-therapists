import { Column, CreateDateColumn, Entity, Index, JoinTable, ManyToMany, PrimaryGeneratedColumn, Table, UpdateDateColumn } from "typeorm";
import { RolesEntity } from "../roles/roles.entity";


@Entity('users')
export class UsersEntity {
  
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index({ unique: true })
  @Column({
    type: 'varchar'
  })
  email: string;

  @Column({ 
    type: 'varchar',
    nullable: true })
  password: string;

  @Column({ default: 'local' })
  provider!: 'local' | 'google' | 'github';

  @Column({ nullable: true })
  providerId!: string;

  @Column({ default: false })
  isActive!: boolean;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @ManyToMany(() => RolesEntity, (role) => role.users)
  @JoinTable({
    name: 'users_roles', 
    joinColumn: {
      name: 'user_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'role_id', 
      referencedColumnName: 'id',
    },
  })
  roles: RolesEntity[];

}