import { IsOptional, IsString } from "class-validator";

export class UpdateProfileDto{


  @IsString()
  @IsOptional()
  phone: string;

  @IsString()
  @IsOptional()
  address: string;
}