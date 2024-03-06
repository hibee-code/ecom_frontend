import { IsNotEmpty, MaxLength, MinLength } from 'class-validator';
import { BaseModel } from './base.model';

export class LGAWardModel extends BaseModel {
  id: string;

  @IsNotEmpty({ message: 'LGA ward name is required' })
  @MinLength(2, { message: 'LGA ward name must be at least 2 characters' })
  @MaxLength(50, { message: 'LGA ward name must be less than 50 characters' })
  name: string;

  @IsNotEmpty({ message: 'Select an LGA' })
  lgaId: string;
}
