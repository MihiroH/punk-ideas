import { ValidationPipe } from '@nestjs/common'

import { CustomBadRequestException } from './errors/customBadRequest.exception'

export class AppValidationPipe extends ValidationPipe {
  constructor() {
    super({
      exceptionFactory: (errors) => {
        const messages = errors.map((error) => ({
          field: error.property,
          error: Object.values(error.constraints)[0],
        }))

        return new CustomBadRequestException(messages)
      },
    })
  }
}
