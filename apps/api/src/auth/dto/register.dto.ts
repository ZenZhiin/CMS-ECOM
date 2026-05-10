import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { RegisterDto as IRegisterDto } from '@cms/shared';

export class RegisterDto implements IRegisterDto {
  @IsEmail({}, { message: 'Invalid email address' })
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6, { message: 'Password must be at least 6 characters' })
  password: string;

  @IsString()
  @IsNotEmpty()
  name: string;
}
