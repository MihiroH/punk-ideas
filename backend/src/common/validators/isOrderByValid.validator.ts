import {
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  registerDecorator,
} from 'class-validator'

import { OrderByArgs } from '../dto/orderBy.args'

@ValidatorConstraint({ async: true })
export class IsOrderByFieldValidConstraint implements ValidatorConstraintInterface {
  validate(orderBy: OrderByArgs | OrderByArgs[], args: ValidationArguments) {
    const fields = args.constraints

    if (Array.isArray(orderBy)) {
      return orderBy.every(({ field }) => fields.includes(field))
    }

    return fields.includes(orderBy.field)
  }

  defaultMessage(args: ValidationArguments) {
    const [fields, orders] = args.constraints
    return `Field must be one of ${fields.join(', ')} and order must be one of ${orders.join(', ')}`
  }
}

export const IsOrderByFieldValid = (fields: string[], validationOptions?: ValidationOptions) => {
  return (object: object, propertyName: string) => {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: fields,
      validator: IsOrderByFieldValidConstraint,
    })
  }
}
