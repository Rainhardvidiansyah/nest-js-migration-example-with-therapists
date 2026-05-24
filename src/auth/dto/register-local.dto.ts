import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";


export class RegisterLocalDto{

  @IsNotEmpty()
  @IsEmail()
  email!: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  password!: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  confirmPassword!: string;
  
  
}