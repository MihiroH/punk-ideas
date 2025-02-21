import { FileValidator } from '@nestjs/common'

import { formatFileSize } from '../helpers/formatFileSize'

export class FileSizeValidationPipe extends FileValidator<{ maxSize: number }> {
  constructor(private readonly maxSize: number) {
    super({ maxSize })
  }

  isValid(file: Express.Multer.File): boolean {
    return file.size <= this.maxSize
  }

  buildErrorMessage(): string {
    return `File size should not exceed ${formatFileSize(this.maxSize)}`
  }
}
