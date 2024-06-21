import { BadRequestException, ValidationPipe } from '@nestjs/common'

export class AppValidationPipe extends ValidationPipe {
  constructor() {
    super({
      exceptionFactory: (errors) => {
        const messages = errors.map((error) => ({
          field: error.property,
          error: Object.values(error.constraints)[0],
        }))
        return new BadRequestException(messages)
      },
    })
  }
}
