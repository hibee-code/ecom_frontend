import { IsNotEmpty, IsOptional } from 'class-validator';
import { BaseModel } from './base.model';

export class BillingModel extends BaseModel {
  @IsOptional()
  streetId: string;

  @IsNotEmpty({ message: 'Please, select the property subscsription' })
  propertySuscriptionId: string;

  @IsNotEmpty({ message: 'Please, select the month' })
  month: string;

  @IsNotEmpty({ message: 'Please, select the year' })
  year: string;

  type: 'print' | 'generate';

  forAllProperties: boolean;

  forPropertiesOnStreet: boolean;
}
