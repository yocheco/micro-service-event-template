import { Env } from './config/env/env'
import { createIndexController } from './controllers/recive/createIndexController'
import { ReciveRmq } from './events/recieve/reciveRmq'
import { IIndexMessage } from './shared/interfaces/rmq/messages/thisService/IIndexMessage'

let reciveRmqCreateIndex: ReciveRmq<IIndexMessage>

class Recivers {
  public start = async (): Promise<void> => {
    // Config rmq reciver
    try {
      const exchangeBaseName: string = Env.EXCHANGE_BASE_NAME
      const eventName: string = 'index.created'
      const queue = 'userService.index.v1.queue.'

      reciveRmqCreateIndex = new ReciveRmq<IIndexMessage>(exchangeBaseName, eventName, queue, createIndexController)
      await reciveRmqCreateIndex.start()
    } catch (error) {
      console.error(error)
    }
  }

  public stop () {
    reciveRmqCreateIndex.stop()
  }
}
export const recivers = new Recivers()
