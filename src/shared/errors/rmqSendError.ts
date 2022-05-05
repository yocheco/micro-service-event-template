import { HttpStatusCode } from '../types/http.model'
import { BaseError } from './baseError'
export class RmqSendError extends BaseError {
  constructor (message: string, methodName = '', httpCode = HttpStatusCode.INTERNAL_SERVER, isOperational = true) {
    super('', message, methodName, httpCode, isOperational)
  }
}
