import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as bodyParser from 'body-parser';

// const cors = process.env.CORS_ORIGIN?.split(',').map((origin) => origin.trim());

async function bootstrap() {
  // Load environment variables from .env file
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    // origin: cors || ['http://localhost:4200'],
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  app.use(bodyParser.json({ limit: '50mb' }));

  await app.listen(process.env.PORT || 3000, '0.0.0.0');
}
bootstrap();
