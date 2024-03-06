import { IsNotEmpty, MaxLength, MinLength } from 'class-validator';
import { BaseModel } from './base.model';

export class StreetModel extends BaseModel {
  id: string;

  @IsNotEmpty({ message: 'Street name is required' })
  @MinLength(2, { message: 'Street name cannot be less than 2 characters' })
  @MaxLength(50, { message: 'Street name cannot be more than 255 characters' })
  name: string;

  @IsNotEmpty({ message: 'Select an Lga' })
  lgaId: string;

  @IsNotEmpty({ message: 'Select an Lga ward' })
  lgaWardId: string;
}
