import { IsEmail, IsString } from 'class-validator';

export class LoginDto {
  @IsString({ message: 'Email cannot be null or empty' })
  @IsEmail()
  email: string;

  @IsString({ message: 'Password cannot be null' })
  password: string;
}
