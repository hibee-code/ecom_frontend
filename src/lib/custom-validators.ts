import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'minLength' })
export class MinLengthValidator implements ValidatorConstraintInterface {
  validate(value: string, args: ValidationArguments) {
    return value.length >= args.constraints[0];
  }
}

// Max validator
@ValidatorConstraint({ name: 'maxLength' })
export class MaxLengthValidator implements ValidatorConstraintInterface {
  validate(
    value: any,
    validationArguments: ValidationArguments
  ): boolean | Promise<boolean> {
    return value.length <= validationArguments.constraints[0];
  }
}

export function MinLength(
  minLength: number,
  validationOptions?: ValidationOptions
) {
  return function (object: Record<string, any>, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [minLength],
      validator: MinLengthValidator,
    });
  };
}

export function MaxLength(
  object: Record<string, any>,
  propertyName: string,
  maxLength: number
) {
  registerDecorator({
    target: object.constructor,
    propertyName: propertyName,
    constraints: [maxLength],
    options: undefined,
    validator: MaxLengthValidator,
  });
}
