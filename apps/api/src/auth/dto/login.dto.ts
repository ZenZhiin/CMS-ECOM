import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { LoginDto as ILoginDto } from '@cms/shared';

export class LoginDto implements ILoginDto {
  @IsEmail({}, { message: 'Invalid email address' })
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
