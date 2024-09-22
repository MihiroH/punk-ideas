interface Messages {
  field: string
  error: string
}

export class CustomBadRequestException extends Error {
  messages: Messages[]

  constructor(details: Messages[], message = 'Bad Request') {
    super(message)
    this.name = 'CustomBadRequestException'
    this.messages = details
  }
}
