import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';
import { config } from 'dotenv';
import { join } from 'path';

config();

const loMigrationConfig = {
  type: `${process.env.DB_TYPE}`,
  host: `${process.env.DB_HOST}`,
  port: Number(process.env.DB_PORT),
  username: `${process.env.DB_USERNAME}`,
  password: `${process.env.DB_PASSWORD}`,
  database: `${process.env.DB_NAME}`,
  synchronize: false,
  logging: true,
  entities: [join(__dirname, '**', '*.entity.{ts,js}')],
  migrations: [join(__dirname, '**/migration/*.{ts,js}')],
} as PostgresConnectionOptions;

export = loMigrationConfig;
