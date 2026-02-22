import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  app.use(cookieParser());

  const configService = app.get(ConfigService);
  const frontendUrl = configService.get<string>('FRONTEND_URL', 'http://localhost:5173');

  // Enable CORS
  app.enableCors({
    origin: frontendUrl,
    credentials: true, // Allow cookies to be sent back and forth
  });

  // Global validation pipe for validating DTOs
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // strip non-whitelisted properties
      forbidNonWhitelisted: true, // throw error if non-whitelisted properties exist
      transform: true, // transform payload to DTO typed objects
    }),
  );

  // Setup Swagger API Documentation
  const config = new DocumentBuilder()
    .setTitle('Rub Jai Tracker API')
    .setDescription('The Rub Jai Tracker API documentation. Designed for learning purposes.')
    .setVersion('1.0')
    .addBearerAuth() // for JWT token testing in swagger
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document); // Swagger available at /api/docs

  // Prefix all routes with /api
  app.setGlobalPrefix('api');

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
