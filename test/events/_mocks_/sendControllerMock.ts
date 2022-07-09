
import { IReciveController } from '../../../src/shared/interfaces/rmq/reciveRmqController'
import { IMockModel } from './model'

class SendControllerMock implements IReciveController<IMockModel> {
  public reciveRMQ = async ({ data } : { data: IMockModel }): Promise<boolean> => {
    if (!data.ok) {
      return false
    }
    return true
  }
}

export const sendControllerMock = new SendControllerMock()
