import { Iindex } from '../../../models'
import amqp from 'amqplib'
import { IMessageBus } from '../../../shared/interfaces/messageBus'
import winstonLogger from '../../../lib/WinstonLogger'
import { RmqError } from '../../../shared/errors/rmqError'
import { Env } from '../../../config/env'

class IndexBusSend {
  public userAdd = async (user: Iindex) => {
    try {
      if (!user) {
        winstonLogger.error(new RmqError('Sould send a valid user to message queue'))
      }
      const connection = await amqp.connect(Env.CONNECTION_RMQ)
      const exchangeName = Env.EXCHANGE_BASE_NAME + 'index.created'
      const channel = await connection.createChannel()

      channel.assertExchange(exchangeName, Env.EXCHANGE_TYPE, { durable: true })

      const indexDemo: Iindex = { name: 'Hola' }

      const message: IMessageBus = {
        data: {
          id: 'sssss',
          occurred: new Date(),
          type: exchangeName,
          attributes: {
            index: indexDemo
          }
        }
      }

      await channel.publish(exchangeName, '', Buffer.from(JSON.stringify(message)), { persistent: true })
      winstonLogger.info('[RabbitMqEventBus] Message send to: ' + exchangeName)
    } catch (error) {
      winstonLogger.error(new RmqError('[RabbitMqEventBus] Error send message to ' + Env.EXCHANGE_BASE_NAME))
    }
  }
}

const indexBusSend = new IndexBusSend()
export default indexBusSend
