import { Iindex } from '../../models'
import { ISendController } from '../../shared/interfaces/rmq/sendRmqController'

class CreateIndexController implements ISendController<Iindex> {
  public reciveRMQ = (data: Iindex): void => {
    // eslint-disable-next-line no-console
    console.log(data)
  }
}

export const createIndexController = new CreateIndexController()
