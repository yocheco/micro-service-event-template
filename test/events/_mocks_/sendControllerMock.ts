import winstonLogger from '../../../src/lib/WinstonLogger'
import { RmqErrorCastMessage } from '../../../src/shared/errors/rmqError'
import { ISendController } from '../../../src/shared/interfaces/rmq/sendRmqController'
import { IMockModel } from './model'

class SendControllerMock implements ISendController<IMockModel> {
  public reciveRMQ = async (data: IMockModel): Promise<void> => {
    try {
      if (!data.ok) {
        throw new RmqErrorCastMessage('IMockModel error data message', 'reciveRMQ', 401, true)
      }
    } catch (error) {
      winstonLogger.error(error as RmqErrorCastMessage)
    }
  }
}

export const sendControllerMock = new SendControllerMock()
