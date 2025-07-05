import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { LoggerModule } from '../../utils/logger/logger.module';
import RedisModule from '../../config/redis/redis.module';
import { DatabaseModule } from '../../config/database/database.module';
import { S3Module } from '../../config/s3/s3.module';
import CoreModule from '../core/core.module';
import V1Module from '../v1/v1.module';
import { AppController } from './app.controller';

@Module({
  imports: [
    LoggerModule,
    RedisModule,
    S3Module,
    DatabaseModule,
    CoreModule,
    V1Module,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
