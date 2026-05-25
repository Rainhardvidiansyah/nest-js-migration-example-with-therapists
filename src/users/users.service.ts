/* eslint-disable prettier/prettier */
import { BadRequestException, ConflictException, Inject, Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { UsersEntity } from './users.entity';
import { encodePassword } from '../utils/password.encoder';
import { CreateUserLocalDto } from './dto/create-user-local.dto';
import { RolesService } from '../roles/roles.service';


@Injectable()
export class UsersService {
    
    
    constructor(
        @Inject('DATA_SOURCE') private readonly dataSource: DataSource,
        @Inject('USERS_REPOSITORY') private userRepository: Repository<UsersEntity>,
        private readonly rolesService: RolesService
        ) {}


    //CREATE NEW USER FOR LOCAL REGISTRATION
    async createLocalUser(createUserLocalDto: CreateUserLocalDto): Promise<UsersEntity> {

        const isEmailExisting = await this.getUserByEmail(createUserLocalDto.email);

        if(isEmailExisting){
            throw new ConflictException('Email already exists');
        }

        if (!createUserLocalDto.password) {
            throw new BadRequestException('Password is required for local provider');
        }
        const hashedPassword = await encodePassword(createUserLocalDto.password);
        
        const role = await this.rolesService.findRoleByRoleName('customer');

        const newUser = this.userRepository.create({ ...createUserLocalDto, 
            provider: "local", password: hashedPassword, roles: [role] });
                
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
        .leftJoinAndSelect('user.roles', 'roles')
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


    //FIND USER BY EMAIL
    async getUserByEmail(email: string): Promise<UsersEntity | null>{
        const user = await this.userRepository.findOne({where: {email: email}});
        return user;
    }

    


}

