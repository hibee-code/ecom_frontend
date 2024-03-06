import { IsBoolean, IsNotEmpty, IsOptional } from 'class-validator';
import { BaseModel } from './base.model';

export class PropertySubscriptionModel extends BaseModel {
  id: string;

  @IsNotEmpty({ message: 'Please, enter the property name' })
  propertyName: string;

  @IsNotEmpty({ message: 'Please, enter the property unit' })
  propertyUnit: number;

  @IsOptional()
  expectedMonthlyCost: string;

  @IsNotEmpty({ message: 'Please, select the property type' })
  propertyTypeId: string;

  @IsNotEmpty({ message: 'Please, select the street' })
  streetId: string;

  @IsNotEmpty({ message: 'Please, enter the street number' })
  streetNumber: string;

  @IsOptional()
  oldCode: string;

  @IsNotEmpty({ message: 'Please, select a custiodian' })
  propertySubscriberProfileId: string;

  @IsBoolean()
  isOwner = false;
}
