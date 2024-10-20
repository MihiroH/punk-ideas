export interface BadExceptionMessage {
  field: string
  error: string
}

export class CustomBadRequestException extends Error {
  messages: BadExceptionMessage[]

  constructor(details: BadExceptionMessage[], message = 'Bad Request') {
    super(message)
    this.name = 'CustomBadRequestException'
    this.messages = details
  }

  static validateOrThrow(conditions: { condition: boolean | (() => boolean); message: BadExceptionMessage }[]) {
    const details = conditions
      .filter(({ condition }) => (typeof condition === 'function' ? condition() : condition))
      .map(({ message }) => message)

    if (details.length > 0) {
      throw new CustomBadRequestException(details)
    }
  }
}
