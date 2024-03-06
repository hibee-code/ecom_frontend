import { ValidationError, validate } from 'class-validator';

export class BaseModel {
  errors?: ValidationError[] = [];
  async validate() {
    const errors = await validate(this);
    for (const err of errors) {
      err.constraints;
    }
    this.errors = errors;
  }

  clearValues() {
    for (const key in this) {
      if (
        this.hasOwnProperty(key) &&
        typeof this[key as keyof this] !== 'function'
      ) {
        (this as unknown as Record<string, null>)[key] = null; // Set to default value or desired empty state
      }
    }
  }
}
