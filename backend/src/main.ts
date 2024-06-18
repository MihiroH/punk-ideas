import { ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: { origin: process.env.API_CORS_ALLOW_ORIGIN ?? '*' } })

  app.useGlobalPipes(new ValidationPipe())

  await app.listen(process.env.API_PORT ?? 8000)
}
bootstrap()
