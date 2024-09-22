import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'

import { CustomExceptionFilter } from './common/filters/customException.filter'
import { AppValidationPipe } from './common/pipes/appValidation.pipe'
import { PrismaClientExceptionFilter } from './prisma/filters/prismaClientException.filter'

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: {
      origin: process.env.API_CORS_ALLOW_ORIGIN ?? '*',
    },
  })

  app.useGlobalPipes(new AppValidationPipe())
  app.useGlobalFilters(new CustomExceptionFilter(), new PrismaClientExceptionFilter())

  await app.listen(process.env.API_PORT ?? 8000)
}
bootstrap()
