import { RmqError } from '../../errors/rmqError'

export interface ISendController<T>{
  reciveRMQ: (data:T) => void | RmqError
}
