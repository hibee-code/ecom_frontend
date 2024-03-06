import { IsNotEmpty, IsNumberString, minLength } from 'class-validator';
import { BaseModel } from './base.model';

export class PaymentModel extends BaseModel {
  id: string;
  @IsNotEmpty({
    message: 'Please, select the property subscrition for payment.',
  })
  propertySubscriptionId: string;

  @IsNotEmpty({ message: 'Payer name is required.' })
  payerName: string;

  @IsNotEmpty({ message: 'Select a payment date' })
  paymentDate: string;

  @IsNotEmpty({ message: 'Please, enter the mount' })
  @IsNumberString({}, { message: 'Please, enter a valid amount' })
  amount: string;
}
