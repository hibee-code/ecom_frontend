import { IsEmail, IsNotEmpty } from 'class-validator';
import { BaseModel } from './base.model';

export default class SigninModel extends BaseModel {
  @IsEmail({}, { message: 'Please enter a valid email' })
  email: string;

  @IsNotEmpty({ message: 'Password is invalid' })
  password: string;
}
