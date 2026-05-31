import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { AllConfigType } from '../config/config.type';
import fs from 'fs';
import path from 'path';

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
  constructor(private readonly configService: ConfigService<AllConfigType>) {}

  private getCertContent(certConfig?: string | null): string | undefined {
    if (!certConfig) return undefined;
    
    // Se o valor fornecido for um caminho de arquivo existente, lê o arquivo
    const fullPath = path.resolve(process.cwd(), certConfig);
    if (fs.existsSync(fullPath)) {
      return fs.readFileSync(fullPath, 'utf8');
    }
    
    // Caso contrário, assume que o valor já é o conteúdo do certificado
    return certConfig;
  }

  createTypeOrmOptions(): TypeOrmModuleOptions {
    const ca = this.getCertContent(this.configService.get('database.ca', { infer: true }));
    const key = this.getCertContent(this.configService.get('database.key', { infer: true }));
    const cert = this.getCertContent(this.configService.get('database.cert', { infer: true }));

    return {
      type:
        this.configService.get('database.type', { infer: true }) ?? 'postgres',
      url: this.configService.get('database.host', { infer: true })
        ? undefined
        : this.configService.get('database.url', { infer: true }),
      host: this.configService.get('database.host', { infer: true }),
      port: this.configService.get('database.port', { infer: true }),
      username: this.configService.get('database.username', { infer: true }),
      password: this.configService.get('database.password', { infer: true }),
      database: this.configService.get('database.name', { infer: true }),
      synchronize: this.configService.get('database.synchronize', {
        infer: true,
      }),
      installExtensions: true,
      dropSchema: false,
      keepConnectionAlive: true,
      logging:
        this.configService.get('app.nodeEnv', { infer: true }) !== 'production',
      entities: [__dirname + '/../**/*.entity{.ts,.js}'],
      migrations: [__dirname + '/migrations/**/*{.ts,.js}'],
      cli: {
        entitiesDir: 'src',

        subscribersDir: 'subscriber',
      },
      extra: {
        // based on https://node-postgres.com/apis/pool
        // max connection pool size
        max: this.configService.get('database.maxConnections', { infer: true }),
        ssl: this.configService.get('database.sslEnabled', { infer: true })
          ? {
              rejectUnauthorized: this.configService.get(
                'database.rejectUnauthorized',
                { infer: true },
              ),
              ca,
              key,
              cert,
            }
          : undefined,
      },
    } as TypeOrmModuleOptions;
  }
}
