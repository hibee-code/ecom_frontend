import {
  IsNotEmpty,
  IsNumberString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { BaseModel } from './base.model';

export class PropertyTypeModel extends BaseModel {
  id: string;

  @IsNotEmpty({ message: 'Property type name is required' })
  @MinLength(2)
  @MaxLength(50)
  name: string;

  @IsNotEmpty({ message: 'Property type unit price is required' })
  @IsNumberString({}, { message: 'Please, type in numeric value.' })
  unitPrice: number;
}
