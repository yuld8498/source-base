import { Injectable, Logger } from '@nestjs/common'
import Redis from 'ioredis'
import { LoggerService } from 'src/utils/logger/logger.service'
import { ShareFunction } from 'src/utils/static-function'

@Injectable()
export default class RedisService {
  private redis: Redis | undefined

  constructor(private readonly logger: LoggerService) {}

  async init() {
    this.redis = new Redis(ShareFunction.env().REDIS_URL)
    this.redis.on('ready', () => {
      this.logger.log('RedisService is init success')
    })
    this.redis.on('error', (e) => {
      this.logger.error(e.message)
    })
    this.redis.on('restart', () => {
      this.logger.log('RedisService to restart the redis server')
    })
  }
}
