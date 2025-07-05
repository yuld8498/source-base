import { JSONAPIErrorOptions } from 'jsonapi-serializer'
import { Request } from 'express'

export interface ExceptionResponse {
  readonly message: unknown

  readonly statusCode: number

  readonly error: string

  readonly errorType: string

  readonly errors: JSONAPIErrorOptions[]
}

export interface RequestExpress extends Request {
  user: any
  aqp: any
}
