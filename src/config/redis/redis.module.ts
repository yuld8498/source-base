import { Global, Module } from '@nestjs/common'
import { LoggerModule } from 'src/utils/logger/logger.module'
import RedisService from './redis.service'

@Global()
@Module({
  imports: [LoggerModule],
  providers: [RedisService],
  exports: [RedisService],
})
export default class RedisModule {}
