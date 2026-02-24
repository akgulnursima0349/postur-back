import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // ─── Global prefix ───────────────────────────────────────────────────────
  app.setGlobalPrefix('api');

  // ─── CORS ─────────────────────────────────────────────────────────────────
  app.enableCors();

  // ─── Validation ──────────────────────────────────────────────────────────
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,       // Strip undeclared fields
      transform: true,       // Auto-transform to DTO types
      forbidNonWhitelisted: false,
    }),
  );

  // ─── Global response transform ────────────────────────────────────────────
  app.useGlobalInterceptors(new TransformInterceptor());

  // ─── Swagger ──────────────────────────────────────────────────────────────
  const config = new DocumentBuilder()
    .setTitle('Straight API')
    .setDescription(
      'Backend API for the Straight posture correction mobile app. ' +
        'All endpoints except /api/users/sync require a Firebase Bearer token.',
    )
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  // ─── Start server ─────────────────────────────────────────────────────────
  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  console.log(`🚀 Straight API running on http://localhost:${port}/api`);
  console.log(`📚 Swagger docs at  http://localhost:${port}/api/docs`);
}

bootstrap();
