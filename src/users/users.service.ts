/* eslint-disable prettier/prettier */
import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { UsersEntity } from './users.entity';
import { comparePassword, encodePassword } from '../utils/password.encoder';


@Injectable()
export class UsersService {
    
    
    constructor(@Inject("USERS_REPOSITORY") private userRepository: Repository<UsersEntity>) {}


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
    async findByEmail(email: string): Promise<UsersEntity | null> {
        if (!email) {
            throw new Error('Email must be provided');
        }
        const user = await this.userRepository.findOne({ where: { email } });
        return user;
    }


    //FIND USER BY EMAIL AND PASSWORD
    async findUserByEmail(email: string, password: string): Promise<UsersEntity> {
        console.log('Finding user by email and password');
        const user = await this.userRepository.findOne({ where: { email } });

        if (!user || !user.password) {
        throw new Error('Invalid credentials');
    }
    const isMatch = await comparePassword(password, user.password);
    
    if (!isMatch) {
        throw new Error('Invalid credentials');
    }
    
    return user;
    }


}

