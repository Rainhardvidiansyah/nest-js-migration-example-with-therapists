import { BadRequestException, ConflictException, Inject, Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { UsersEntity } from './users.entity';
import { encodePassword } from '../utils/password.encoder';
import { CreateUserLocalDto } from './dto/create-user-local.dto';
import { RolesService } from '../roles/roles.service';
import { CustomerService } from 'src/customer/customer.service';


@Injectable()
export class UsersService {
    
    
    constructor(
        @Inject('DATA_SOURCE') private readonly dataSource: DataSource,
        @Inject('USERS_REPOSITORY') private userRepository: Repository<UsersEntity>,
        private readonly customerProfileService: CustomerService,
        private readonly rolesService: RolesService
        ) {}


    //CREATE NEW USER FOR LOCAL REGISTRATION
    async createLocalUser(createUserLocalDto: CreateUserLocalDto): Promise<UsersEntity> {

      const isEmailExisting = await this.getUserByEmail(createUserLocalDto.email);
    
        if(isEmailExisting) {
            throw new ConflictException('Email already exists');
        }
        
        if (!createUserLocalDto.password) {
            throw new BadRequestException('Password is required for local provider');
        }

        const hashedPassword = await encodePassword(createUserLocalDto.password);
        
        const role = await this.rolesService.findRoleByRoleName('customer');

        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try{
        const newUser = await queryRunner.manager.save(UsersEntity, {
          email: createUserLocalDto.email,
          provider: 'local',
          password: hashedPassword,
          roles: [role]
        });

        await this.customerProfileService.createCustomerProfiles(newUser, queryRunner);

        await queryRunner.commitTransaction();

        return newUser;

        }catch(error){
        await queryRunner.rollbackTransaction();
          throw error;

        } finally{
        await queryRunner.release();
        }
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

