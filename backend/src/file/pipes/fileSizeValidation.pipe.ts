import { FileValidator } from '@nestjs/common'

export class FileSizeValidationPipe extends FileValidator<{ maxSize: number }> {
  constructor(private readonly maxSize: number) {
    super({ maxSize })
  }

  isValid(file: Express.Multer.File): boolean {
    return file.size <= this.maxSize
  }

  buildErrorMessage(): string {
    return `File size should not exceed ${this.maxSize / 1024 / 1024}MB`
  }
}
