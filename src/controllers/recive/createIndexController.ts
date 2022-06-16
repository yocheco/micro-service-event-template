import { Iindex } from '../../models'
import { RmqError } from '../../shared/errors/rmqError'
import { ISendController } from '../../shared/interfaces/rmq/sendRmqController'

class CreateIndexController implements ISendController<Iindex> {
  public reciveRMQ = (data: Iindex): void => {
    const n = Math.floor(Math.random() * 10)

    if (n > 5) throw new RmqError('[SendControllerMock/reciveRMQ] error cast message')
    // eslint-disable-next-line no-console
    console.log(data)
  }
}

export const createIndexController = new CreateIndexController()
