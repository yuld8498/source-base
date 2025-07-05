import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LoggerModule } from './utils/logger/logger.module';
import RedisModule from './config/redis/redis.module';
import { DatabaseModule } from './config/database/database.module';
import { S3Module } from './config/s3/s3.module';
import CoreModule from './route/core/core.module';
import ApiModule from './route/api/api.module';

@Module({
  imports: [
    LoggerModule,
    RedisModule,
    S3Module,
    DatabaseModule,
    CoreModule,
    ApiModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
