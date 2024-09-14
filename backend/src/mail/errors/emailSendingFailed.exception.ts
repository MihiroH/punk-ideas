export class EmailSendingFailedException extends Error {
  constructor(message = 'Failed to send email') {
    super(message)
    this.name = 'EmailSendingFailedException'
  }
}
