import { createIndexController } from './controllers/recive/createIndexController'
import { ReciveRmq } from './events/recieve/reciveRmq'
import { Iindex } from './models'

let reciveRmqCreateIndex: ReciveRmq<Iindex>

class Recivers {
  public start = async (): Promise<void> => {
    // Config rmq reciver
    try {
      const eventName: string = 'index.created'
      const queue = 'userService.index.v1.queue.'

      reciveRmqCreateIndex = new ReciveRmq<Iindex>(eventName, queue, createIndexController)
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
