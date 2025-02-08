import { Module } from '@nestjs/common'

import { StorageModule } from '@src/storage/storage.module'
import { FileController } from './file.controller'
import { FileService } from './file.service'

@Module({
  imports: [StorageModule],
  providers: [FileService],
  controllers: [FileController],
})
export class FileModule {}
