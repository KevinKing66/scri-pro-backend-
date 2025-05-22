import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  // Load environment variables from .env file
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: process.env.CORS_ORIGIN?.split(', ') || ['http://localhost:4200'],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  await app.listen(process.env.PORT || 3000, '0.0.0.0');
  console.log(`Aplicación corriendo en el puerto ${process.env.PORT}`);
}
bootstrap();
