import {
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  registerDecorator,
} from 'class-validator'

@ValidatorConstraint({ async: false })
export class IsPasswordValidConstraint implements ValidatorConstraintInterface {
  validate(password: string) {
    // パスワードが8文字以上かつ英字と数字を含むかをチェック
    return typeof password === 'string' && password.length >= 8 && /[A-Za-z]/.test(password) && /[0-9]/.test(password)
  }

  defaultMessage() {
    return 'Password must be at least 8 characters long and contain both letters and numbers'
  }
}

export const isPasswordValid = (validationOptions?: ValidationOptions) => {
  return (object: object, propertyName: string) => {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsPasswordValidConstraint,
    })
  }
}

// dto用
export const IsPasswordValid = isPasswordValid
