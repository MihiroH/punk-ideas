import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { v4 as uuidv4 } from 'uuid'

import { CustomInternalServerErrorException } from '@src/common/errors/customInternalServerError.exception'

@Injectable()
export class StorageService {
  private isLocal: boolean
  private region: string
  private endpoint: string | undefined
  private bucketName: string
  private s3Client: S3Client

  baseUrl: string

  constructor(private configService: ConfigService) {
    const isLocal: boolean = this.configService.get('NODE_ENV') === 'local'
    const region: string | undefined = this.configService.get('AWS_REGION')
    const endpoint: string | undefined = this.configService.get('S3_ENDPOINT')
    const accessKeyId: string | undefined = this.configService.get('AWS_ACCESS_KEY_ID')
    const secretAccessKey: string | undefined = this.configService.get('AWS_SECRET_ACCESS_KEY')
    const bucketName: string | undefined = this.configService.get('S3_BUCKET')

    const undefinedEnvVars: string[] = []

    if (!region) {
      undefinedEnvVars.push('AWS_REGION')
    }

    if (!endpoint && isLocal) {
      undefinedEnvVars.push('S3_ENDPOINT')
    }

    if (!accessKeyId) {
      undefinedEnvVars.push('AWS_ACCESS_KEY_ID')
    }

    if (!secretAccessKey) {
      undefinedEnvVars.push('AWS_SECRET_ACCESS_KEY')
    }

    if (!bucketName) {
      undefinedEnvVars.push('S3_BUCKET')
    }

    // !region || !accessKeyId || !secretAccessKey || !bucketNameのチェックは本来不要だが、後の行でtsエラーになってしまうため追加
    if (undefinedEnvVars.length > 0 || !region || !accessKeyId || !secretAccessKey || !bucketName) {
      throw new CustomInternalServerErrorException(
        `${undefinedEnvVars.join(', ')} is not defined in the environment variables`,
      )
    }

    this.isLocal = isLocal
    this.region = region
    this.endpoint = endpoint
    this.bucketName = bucketName

    this.s3Client = new S3Client({
      region,
      endpoint: isLocal ? endpoint : undefined,
      forcePathStyle: isLocal,
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
    })

    this.baseUrl =
      isLocal && endpoint ? `${endpoint}/${bucketName}` : `https://${bucketName}.s3.${region}.amazonaws.com`
  }

  getFileUrl(fileName: string): string {
    return `${this.baseUrl}/${fileName}`
  }

  private generateUniqueFileName(originalName: string): string {
    const extension = originalName.split('.').pop()
    return `${uuidv4()}.${extension}`
  }

  async uploadFile(image: { name: string; mimetype: string; data: Buffer }): Promise<string> {
    const uniqueFileName = this.generateUniqueFileName(image.name)
    const params = {
      Bucket: this.bucketName,
      Key: uniqueFileName,
      Body: image.data,
      ContentType: image.mimetype,
    }

    try {
      await this.s3Client.send(new PutObjectCommand(params))

      return uniqueFileName
    } catch (error) {
      throw new CustomInternalServerErrorException(`Error uploading image: ${error.message}`)
    }
  }
}
