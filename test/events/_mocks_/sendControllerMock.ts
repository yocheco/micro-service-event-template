
import { ISendController } from '../../../src/shared/interfaces/rmq/sendRmqController'
import { IMockModel } from './model'

class SendControllerMock implements ISendController<IMockModel> {
  public reciveRMQ = async ({ data } : { data: IMockModel }): Promise<boolean> => {
    if (!data.ok) {
      return false
    }
    return true
  }
}

export const sendControllerMock = new SendControllerMock()
