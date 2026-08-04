import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { join } from 'path';
import * as path from 'path';
import { Request, Response, NextFunction } from 'express';

import cookieParser from 'cookie-parser';
import {
  PrismaExceptionFilter,
  PrismaValidationExceptionFilter,
} from './common/filters/prisma-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    bufferLogs: true,
  });

  app.use(cookieParser());

  app.setGlobalPrefix('api');
  app.useGlobalFilters(
    new PrismaValidationExceptionFilter(),
    new PrismaExceptionFilter(),
  );

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: false,
      transform: true,
    }),
  );

  app.enableCors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (process.env.NODE_ENV !== 'production') return callback(null, true);
      if (origin === process.env.FRONTEND_URL) return callback(null, true);
      callback(new Error('Not allowed by CORS'));
    },
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  });

  app.useStaticAssets(join(process.cwd(), 'public'));

  // SPA fallback — must come AFTER useStaticAssets
  app.use((req: Request, res: Response, next: NextFunction) => {
    if (req.path.startsWith('/api') || req.path.startsWith('/_nuxt')) {
      return next();
    }
    if (req.path.includes('.')) {
      return next(); // let express handle static files with extensions
    }

    // For all other routes (e.g. /forms, /bucket/ipcr), serve the SPA shell
    const fallback = path.resolve(process.cwd(), 'public', 'index.html');
    res.sendFile(fallback);
  });

  await app.listen(9004, '0.0.0.0');
}

bootstrap().catch((err) => console.error(err));
