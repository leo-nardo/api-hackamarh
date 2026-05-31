import 'dotenv/config';
import {
  ClassSerializerInterceptor,
  ValidationPipe,
  VersioningType,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory, Reflector } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { useContainer } from 'class-validator';
import validationOptions from './utils/validation-options';
import { AllConfigType } from './config/config.type';
import { ResolvePromisesInterceptor } from './utils/serializer.interceptor';

async function bootstrap() {
  console.log('--- BOOTSTRAP PHASE 1: Process Started ---');
  
  try {
    // Carregamento dinâmico do AppModule para capturar erros de importação/validação
    console.log('--- BOOTSTRAP PHASE 2: Loading AppModule... ---');
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { AppModule } = require('./app.module');
    
    console.log('--- BOOTSTRAP PHASE 3: Creating Nest Instance... ---');
    const app = await NestFactory.create(AppModule, { cors: true });
    
    useContainer(app.select(AppModule), { fallbackOnErrors: true });
    const configService = app.get(ConfigService<AllConfigType>);

    app.enableShutdownHooks();
    app.setGlobalPrefix(
      configService.getOrThrow('app.apiPrefix', { infer: true }),
      {
        exclude: ['/'],
      },
    );
    app.enableVersioning({
      type: VersioningType.URI,
    });
    app.useGlobalPipes(new ValidationPipe(validationOptions));
    app.useGlobalInterceptors(
      new ResolvePromisesInterceptor(),
      new ClassSerializerInterceptor(app.get(Reflector)),
    );

    const options = new DocumentBuilder()
      .setTitle('API')
      .setDescription('API docs')
      .setVersion('1.0')
      .addBearerAuth()
      .addGlobalParameters({
        in: 'header',
        required: false,
        name: process.env.APP_HEADER_LANGUAGE || 'x-custom-lang',
        schema: {
          example: 'en',
        },
      })
      .build();

    const document = SwaggerModule.createDocument(app, options);
    SwaggerModule.setup('docs', app, document);

    const port = configService.getOrThrow('app.port', { infer: true });
    console.log(`--- BOOTSTRAP SUCCESS: Application starting on port ${port} ---`);
    await app.listen(port);
  } catch (error) {
    console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
    console.log('FATAL ERROR DURING BOOTSTRAP / MODULE LOADING:');
    console.log(error);
    if (error.stack) console.log(error.stack);
    console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
    
    // Pequeno atraso para garantir que o log seja enviado ao Render
    await new Promise(resolve => setTimeout(resolve, 5000));
    process.exit(1);
  }
}

void bootstrap();
