export class CustomInternalServerErrorException extends Error {
  constructor(message = 'Internal server error') {
    super(message)
    this.name = 'CustomInternalServerErrorException'
  }
}
