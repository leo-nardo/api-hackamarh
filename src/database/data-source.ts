import 'reflect-metadata';
import { DataSource, DataSourceOptions } from 'typeorm';
import * as fs from 'fs';
import * as path from 'path';

const getSslConfig = () => {
  if (process.env.DATABASE_SSL_ENABLED !== 'true') {
    return undefined;
  }

  const sslConfig: any = {
    rejectUnauthorized: process.env.DATABASE_REJECT_UNAUTHORIZED === 'true',
  };

  const caFile = process.env.DATABASE_CA || 'ca.pem';
  const caPath = path.isAbsolute(caFile)
    ? caFile
    : path.join(process.cwd(), caFile);

  if (fs.existsSync(caPath)) {
    sslConfig.ca = fs.readFileSync(caPath, 'utf8');
  } else if (process.env.DATABASE_CA) {
    sslConfig.ca = process.env.DATABASE_CA;
  }

  if (process.env.DATABASE_KEY) {
    const keyPath = path.isAbsolute(process.env.DATABASE_KEY)
      ? process.env.DATABASE_KEY
      : path.join(process.cwd(), process.env.DATABASE_KEY);

    if (fs.existsSync(keyPath)) {
      sslConfig.key = fs.readFileSync(keyPath, 'utf8');
    } else {
      sslConfig.key = process.env.DATABASE_KEY;
    }
  }

  if (process.env.DATABASE_CERT) {
    const certPath = path.isAbsolute(process.env.DATABASE_CERT)
      ? process.env.DATABASE_CERT
      : path.join(process.cwd(), process.env.DATABASE_CERT);

    if (fs.existsSync(certPath)) {
      sslConfig.cert = fs.readFileSync(certPath, 'utf8');
    } else {
      sslConfig.cert = process.env.DATABASE_CERT;
    }
  }

  return sslConfig;
};

export const AppDataSource = new DataSource({
  type: process.env.DATABASE_TYPE ?? 'postgres',
  // Se tivermos os parâmetros individuais, preferimos eles para garantir que o SSL seja aplicado corretamente
  url: process.env.DATABASE_HOST ? undefined : process.env.DATABASE_URL,
  host: process.env.DATABASE_HOST,
  port: process.env.DATABASE_PORT
    ? parseInt(process.env.DATABASE_PORT, 10)
    : 5432,
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  synchronize: process.env.DATABASE_SYNCHRONIZE === 'true',
  installExtensions: true,
  dropSchema: false,
  keepConnectionAlive: true,
  logging: process.env.NODE_ENV !== 'production',
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  migrations: [__dirname + '/migrations/**/*{.ts,.js}'],
  cli: {
    entitiesDir: 'src',

    subscribersDir: 'subscriber',
  },
  extra: {
    // based on https://node-postgres.com/api/pool
    // max connection pool size
    max: process.env.DATABASE_MAX_CONNECTIONS
      ? parseInt(process.env.DATABASE_MAX_CONNECTIONS, 10)
      : 100,
    ssl: getSslConfig(),
  },
} as DataSourceOptions);
