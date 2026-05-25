import { Expose } from "class-transformer";



export class LoginResponseDto{

  @Expose()
  id: string;

  @Expose()
  email: string;

  @Expose()
  roles: string[];

  @Expose()
  access_token: string;

  constructor(data: any) {
    this.id = data.id!;
    this.email = data.email!;
    this.roles = data.roles
    this.access_token = data.access_token;
  }

}

