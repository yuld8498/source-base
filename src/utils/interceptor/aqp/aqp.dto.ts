import { ApiPropertyOptional } from '@nestjs/swagger'
import { IsArray, IsNumber, IsObject, Max, Min } from 'class-validator'

export default class AqpDto {
  @IsObject()
  readonly filter: object = {}

  @IsNumber()
  @Min(0)
  readonly skip: number = 0

  @IsNumber()
  @Max(999)
  readonly limit: number = 20

  @IsObject()
  readonly sort: object = {}

  @IsObject()
  readonly projection: object = {}

  @IsArray()
  readonly population: any[] = []
}
