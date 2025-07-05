// src/health/health.controller.ts
import { Controller, Get } from '@nestjs/common';
import { ApiExtraModels, ApiTags } from '@nestjs/swagger';
import {
  HealthCheck,
  HealthCheckService,
  TypeOrmHealthIndicator,
} from '@nestjs/terminus';

@ApiTags('HealthCheck')
@Controller()
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private db: TypeOrmHealthIndicator
  ) {}

  @Get()
  @HealthCheck()
  check() {
    return this.health.check([async () => this.db.pingCheck('database')]);
  }
}
