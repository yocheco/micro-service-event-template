import { Iindex } from '../../models'
import { ISendController } from '../../shared/interfaces/rmq/sendRmqController'

class CreateIndexController implements ISendController<Iindex> {
  public reciveRMQ = async ({ data }:{ data: Iindex }): Promise<boolean> => {
    const n = Math.floor(Math.random() * 10)

    if (n > 5) return false
    // eslint-disable-next-line no-console
    console.log(data)
    return true
  }
}

export const createIndexController = new CreateIndexController()
