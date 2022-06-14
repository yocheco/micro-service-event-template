import { RmqError } from '../../../../userService/src/shared/errors/rmqError'
import { RmqErrorCastMessage } from '../../../src/shared/errors/rmqError'
import { ISendController } from '../../../src/shared/interfaces/rmq/sendRmqController'
import { IMockModel } from './model'

class SendControllerMock implements ISendController<IMockModel> {
  public reciveRMQ = (data: IMockModel): void | RmqError => {
    if (!data.ok) {
      return new RmqErrorCastMessage('IMockModel error data message')
    }
  }
}

export const sendControllerMock = new SendControllerMock()
