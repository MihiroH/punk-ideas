import { Injectable } from '@nestjs/common'
import { StorageService } from '@src/storage/storage.service'

@Injectable()
export class FileService {
  constructor(private readonly storageService: StorageService) {}

  async saveFile(file: Express.Multer.File): Promise<string> {
    const uploadedFileName = await this.storageService.uploadFile({
      name: file.originalname,
      mimetype: file.mimetype,
      data: file.buffer,
    })

    return this.storageService.getFileUrl(uploadedFileName)
  }
}
