export class ResourceNotFoundException extends Error {
  constructor(message = 'Resource not found') {
    super(message)
    this.name = 'ResourceNotFoundException'
  }
}
