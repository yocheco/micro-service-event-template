import { HttpStatusCode } from '../types/http.model'
import { BaseError } from './baseError'

export class RmqError extends BaseError {
  constructor (message: string, methodName = '', httpCode = HttpStatusCode.INTERNAL_SERVER, isOperational = true) {
    super('', message, methodName, httpCode, isOperational)
  }
}

export class RmqErrorCastMessage extends BaseError {
  constructor (message: string, methodName = '', httpCode = HttpStatusCode.INTERNAL_SERVER, isOperational = true) {
    super('', message, methodName, httpCode, isOperational)
  }
}
