// import { ValidationPipe } from '@nestjs/common';
// import { NestFactory } from '@nestjs/core';

// import { AppModule } from './app.module';

// async function bootstrap() {
//   const app = await NestFactory.create(AppModule);

//   app.enableCors({
//     origin: 'http://localhost:3000',
//     credentials: true,
//   });

//   app.setGlobalPrefix('api');

//   app.useGlobalPipes(
//     new ValidationPipe({
//       whitelist: true,
//       forbidNonWhitelisted: true,
//       transform: true,
//       transformOptions: {
//         enableImplicitConversion: true,
//       },
//     }),
//   );

//   await app.listen(5000);

//   console.log(
//     'Backend running on http://localhost:5000',
//   );

//   console.log(
//     'API running on http://localhost:5000/api',
//   );
// }

// bootstrap();



import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = Number(process.env.API_PORT) || 5000;

  const configuredFrontendOrigins = (process.env.FRONTEND_ORIGINS || '')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);
  const allowedFrontendOrigins = new Set([
    'http://localhost:3000',
    'http://127.0.0.1:3000',
    ...configuredFrontendOrigins,
  ]);

  app.enableCors({
    origin: (
      origin: string | undefined,
      callback: (error: Error | null, allow?: boolean) => void,
    ) => {
      if (!origin || allowedFrontendOrigins.has(origin)) {
        callback(null, true);
        return;
      }

      // Allow private network hosts on the Next.js dev port, so a frontend
      // opened from another device on the same LAN can call this API.
      if (process.env.NODE_ENV !== 'production') {
        try {
          const parsedOrigin = new URL(origin);
          const host = parsedOrigin.hostname.replace(/^\[|\]$/g, '');
          const isPrivateIpv4 =
            /^10\./.test(host) ||
            /^192\.168\./.test(host) ||
            /^172\.(1[6-9]|2\d|3[01])\./.test(host);
          const isLocal = host === 'localhost' || host === '127.0.0.1' || host === '::1';

          if (parsedOrigin.protocol === 'http:' && parsedOrigin.port === '3000' && (isPrivateIpv4 || isLocal)) {
            callback(null, true);
            return;
          }
        } catch {
          // Reject malformed origins below.
        }
      }

      callback(new Error('Origin is not allowed by CORS'));
    },
    credentials: true,
  });

  app.setGlobalPrefix('api');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  await app.listen(port);

  console.log(
    `API running on http://localhost:${port}/api`,
  );
}

void bootstrap();
