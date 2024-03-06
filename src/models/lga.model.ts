import { IsNotEmpty, MaxLength, MinLength } from 'class-validator';
import { BaseModel } from './base.model';

export class LGAModel extends BaseModel {
  id: string;

  @IsNotEmpty({ message: 'LGA name is required' })
  @MinLength(2, { message: 'LGA name must be at least 2 characters' })
  @MaxLength(50, { message: 'LGA name must be less than 50 characters' })
  name: string;
}
