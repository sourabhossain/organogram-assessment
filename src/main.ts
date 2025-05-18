import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as express from 'express';
import { json } from 'express';
import helmet from 'helmet';
import { join } from 'path';
import { AppModule } from './app.module';

async function bootstrap() {
    const host = process.env.HOST ?? 'localhost';
    const port = process.env.PORT || 8000;
    const app = await NestFactory.create<NestExpressApplication>(AppModule);

    app.enableCors();

    app.use(
        '/styles.css',
        express.static(join(__dirname, '..', 'public', 'styles.css'), {
            setHeaders: (res) => {
                res.setHeader('Content-Type', 'text/css');
            }
        })
    );

    app.useStaticAssets(join(__dirname, '..', 'public'));

    app.use(
        helmet({
            contentSecurityPolicy: {
                directives: {
                    defaultSrc: ["'self'"],
                    scriptSrc: ["'self'", "'unsafe-inline'", 'https://cdn.jsdelivr.net'],
                    styleSrc: ["'self'", "'unsafe-inline'", 'https://cdn.jsdelivr.net'],
                    imgSrc: ["'self'", 'data:'],
                    connectSrc: ["'self'"]
                }
            }
        })
    );

    app.use(json({ limit: '2mb' }));
    const config = new DocumentBuilder()
        .setTitle('Organogram API')
        .setDescription('API docs for organogram system')
        .setVersion('1.0')
        .addBearerAuth()
        .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api-docs', app, document);

    app.useGlobalPipes(
        new ValidationPipe({
            transform: true,
            whitelist: true,
            forbidNonWhitelisted: true
        })
    );

    await app.listen(port);

    Logger.log(`Server is Running(🔥) on http://${host}:${port}/`, 'Organogram');
    Logger.log(`Swagger API Collection(🔥) on http://${host}:${port}/api-docs/`, 'Organogram');
}

bootstrap().catch((err) => {
    console.error('Bootstrap error:', err);
    process.exit(1);
});
