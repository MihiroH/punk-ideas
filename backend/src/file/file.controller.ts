import { Controller, Post, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common'
import { ParseFilePipe } from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'

import { JwtRestAuthGuard } from '@src/auth/guards/jwtRestAuth.guard'
import { CustomBadRequestException } from '@src/common/errors/customBadRequest.exception'
import { FileService } from './file.service'
import { FileSizeValidationPipe } from './pipes/fileSizeValidation.pipe'

@Controller('file')
export class FileController {
  constructor(private fileService: FileService) {}

  @Post('upload-image')
  @UseGuards(JwtRestAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  async uploadFileAndPassValidation(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new FileSizeValidationPipe(5 * 1024 * 1024), // 5MBの制限
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    if (!file) {
      throw new CustomBadRequestException([{ field: 'file', error: 'file is required' }])
    }

    const fileUrl = await this.fileService.saveFile(file)

    return { message: 'File uploaded successfully', fileUrl }
  }
}
