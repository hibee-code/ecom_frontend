import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  MaxLength,
  MinLength,
} from 'class-validator';
import { BaseModel } from './base.model';

export class SubscriberModel extends BaseModel {
  id: string;

  @IsNotEmpty({ message: 'First name is required' })
  @MinLength(2, { message: 'First name must be at least 2 characters' })
  @MaxLength(50, { message: 'First name must be less than 50 characters' })
  firstName: string;

  @IsNotEmpty({ message: 'Last name is required' })
  lastName: string;

  @IsNotEmpty({ message: 'Email is required' })
  @IsEmail({}, { message: 'Email is invalid' })
  email: string;

  @IsOptional()
  oldCode: string;

  // TODO: check for existing phone number
  @IsNotEmpty({ message: 'Phone number is required' })
  phone: string;

  @IsNotEmpty({ message: 'Phone code is required' })
  phoneCodeId: string;

  @IsOptional()
  password: string;
}
