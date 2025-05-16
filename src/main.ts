import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Logger, ValidationPipe } from '@nestjs/common';
import { join } from 'path';
import { json } from 'express';
import { NestExpressApplication } from '@nestjs/platform-express';
import helmet from 'helmet';

async function bootstrap() {
    const host = process.env.HOST ?? 'localhost';
    const port = process.env.PORT || 3000;
    const app = await NestFactory.create<NestExpressApplication>(AppModule);

    app.use(helmet());
    app.useStaticAssets(join(__dirname, '..', 'public'));
    app.enableCors();
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

    Logger.log(`Server is Running(🔥) on http://${host}:${port}/`, 'City Group');
    Logger.log(`Swagger API Collection(🔥) on http://${host}:${port}/api-doc/`, 'City Group');
}
bootstrap().catch((error: unknown) => {
    if (error instanceof Error) {
        console.error('Application failed to start:', error.message);
        console.error(error.stack);
    } else {
        console.error('Application failed to start:', error);
    }
});
