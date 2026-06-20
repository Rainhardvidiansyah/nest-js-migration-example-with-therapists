import { CustomerProfilesEntity } from "../customers.entity";


export class UpdateProfileResponseDto{

  userId!: string;

  email!: string;

  phoneNumber!: string;

  address!: string;

  constructor(profile: CustomerProfilesEntity){
    this.userId = profile.user.id;
    this.email = profile.user.email;
    this.phoneNumber = profile.phone;
    this.address = profile.address;
  }


}