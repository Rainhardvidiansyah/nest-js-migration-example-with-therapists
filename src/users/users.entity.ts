import { Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";


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
  provider: 'local' | 'google' | 'github';

  @Column({ nullable: true })
  providerId: string;

  @Column({ default: false })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

}