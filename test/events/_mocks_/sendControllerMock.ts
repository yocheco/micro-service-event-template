
import { RmqError } from '../../../src/shared/errors/rmqError'
import { ISendController } from '../../../src/shared/interfaces/rmq/sendRmqController'
import { IMockModel } from './model'

class SendControllerMock implements ISendController<IMockModel> {
  public reciveRMQ = async (data: IMockModel): Promise<void> => {
    if (!data.ok) {
      throw new RmqError('[SendControllerMock/reciveRMQ] error cast message')
    }
  }
}

export const sendControllerMock = new SendControllerMock()
