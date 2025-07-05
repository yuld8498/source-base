import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import { join } from 'path';

// Load environment variables
config();

// Create and export the DataSource
export const AppDataSource = new DataSource({
  type: (process.env.DB_TYPE as any) || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || '1234',
  database: process.env.DB_NAME || 'nestjs_db',
  synchronize: false,
  logging: true,
  entities: [join(__dirname, '../../**/*.entity.{ts,js}')],
  migrations: [join(__dirname, './migration/*.{ts,js}')],
});

// Default export for TypeORM CLI
export default AppDataSource;
