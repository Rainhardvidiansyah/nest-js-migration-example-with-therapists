import { BadRequestException, Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { DataSource, QueryRunner, Repository } from 'typeorm';
import { CustomerProfilesEntity } from './customers.entity';
import { UsersEntity } from 'src/users/users.entity';
import { UpdateProfileDto } from './dto/UpdateProfile.dto';

@Injectable()
export class CustomerService {


  private logger = new Logger(CustomerService.name);

  
  constructor(
    @Inject('DATA_SOURCE') private readonly dataSource: DataSource,
    @Inject('CUSTOMER_REPOSITORY') private readonly customerRepository: Repository<CustomerProfilesEntity>,
  
  ){}


  //SAVE CUSTOMER
  async createCustomerProfiles(user: UsersEntity, queryRunner: QueryRunner): Promise<CustomerProfilesEntity>{
    
    this.logger.log(`Create Customer Profile hit...`);

    this.logger.log(`User: ${JSON.stringify(user)}`);

    this.logger.log(`Entities: ${JSON.stringify(queryRunner.dataSource.entityMetadatas.map(e => e.name))}`);

    const customerProfile = await queryRunner.manager.save(CustomerProfilesEntity, {
      user: user
    });

    this.logger.log(`Customer profile: ${JSON.stringify(customerProfile)}`);

    return customerProfile;
  }


  //EDIT PROFILE
  async editProfiles(userEntity: UsersEntity, updateProfileDto: UpdateProfileDto): Promise<CustomerProfilesEntity>{
    
    this.logger.log(`Edit Profiles method is hit`);

    console.log(`User in edit profiles method: ${JSON.stringify(userEntity)}`)

    const profile = await this.oneProfile(userEntity);

    Object.assign(profile, updateProfileDto);

    const updatedProfile = await this.customerRepository.save(profile);

    return updatedProfile;
  }



  //GET ONE CUSTOMER BY ID
  async getCustomerProfilesByUserId(userEntity: UsersEntity): Promise<CustomerProfilesEntity>{
    this.logger.log(`Get One Customer Profiles method is hit`);
    
    const profile = await this.oneProfile(userEntity);
    
    return profile;
  }


  //PRIVATE METHOD TO BE USED IN TWO METHODS: GET ONE CUSTOMER BY ID AND EDIT PROFILE
  private async oneProfile(userEntity: UsersEntity): Promise<CustomerProfilesEntity>{

    if (!userEntity || !userEntity.id) {
      throw new BadRequestException('User ID Not Found or does not exist!!');
    }

    const profile = await this.customerRepository.findOne({ where: 
      {
        user: { id: userEntity.id }
      },
      relations: { user: true }
    });

    if(!profile){
      throw new NotFoundException(`Profile not found`);
    }

    return profile;
  }



}
