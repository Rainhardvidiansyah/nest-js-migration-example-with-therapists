import { Body, Controller, Get, HttpCode, HttpStatus, Patch } from '@nestjs/common';
import { CustomerService } from './customer.service';
import { UpdateProfileDto } from './dto/UpdateProfile.dto';
import { ResponseMessage } from 'src/common/decorators/response-message.decorators';
import { User } from 'src/common/decorators/user-decorators';
import { Roles } from 'src/common/decorators/roles.decorators';
import { Role } from 'src/common/enums/role.enum';
import { UsersEntity } from 'src/users/users.entity';
import { UpdateProfileResponseDto } from './dto/update-profile-response.dto';

@Controller('customer')
export class CustomerController {

  constructor(private readonly customerService: CustomerService){}


  @Patch('edit')
  @ResponseMessage('Profile has been updated')
  @Roles(Role.CUSTOMER)
  @HttpCode(HttpStatus.OK)
  async editProfile(@User() user: UsersEntity, @Body() updateProfileDto: UpdateProfileDto){
    const profile = await this.customerService.editProfiles(user, updateProfileDto);
    return new UpdateProfileResponseDto(profile);
  }



  @ResponseMessage('Profile is successfully fetched')
  @Roles(Role.CUSTOMER)
  @HttpCode(HttpStatus.OK)
  @Get('/')
  async getOneCustomer(@User() user: UsersEntity){
    const profile = await this.customerService.getCustomerProfilesByUserId(user);
    return new UpdateProfileResponseDto(profile);
  }


}
