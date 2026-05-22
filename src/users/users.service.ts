/* eslint-disable prettier/prettier */
import { Inject, Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { UsersEntity } from './users.entity';
import { comparePassword, encodePassword } from '../utils/password.encoder';


@Injectable()
export class UsersService {
    
    
    constructor(
        @Inject('DATA_SOURCE') private readonly dataSource: DataSource,
        @Inject('USERS_REPOSITORY') private userRepository: Repository<UsersEntity>, 
        ) {}


  //CREATE NEW USER
    async createUser(email: string, password: string, provider: 'local' | 'google' | 'github', providerId?: string): Promise<UsersEntity> {
        const hashedPassword = await encodePassword(password);

        if(provider === 'local'){
            if(!password){
                throw new Error('Password is required for local provider');
        }}
        
        const newUser = this.userRepository.create({ email, password: hashedPassword, provider, providerId });
        return this.userRepository.save(newUser);
    }



    //FIND USER BY EMAIL
    async findByEmail(email: string): Promise<UsersEntity> {
        
        if (!email) {
            throw new Error('Email must be provided');
        }

        const user = await this.dataSource.getRepository(UsersEntity)

        .createQueryBuilder('user')
        .where('user.email = :email', { email: email })
        .getOne();

        if (!user) {
            throw new Error('User not found');
        }

        return user;
    }


    //FIND ALL USERS
    async findAll(): Promise<UsersEntity[]> {
        return this.userRepository.find();
    }


    


}

