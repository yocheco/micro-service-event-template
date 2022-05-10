import { Iindex } from '../../../models'
import amqp from 'amqplib'
import { IMessageBus } from '../../../shared/interfaces/messageBus'
import winstonLogger from '../../../lib/WinstonLogger'
import { RmqError } from '../../../shared/errors/rmqError'

const EXCHANGE_BASE_NAME = process.env.EXCHANGE_BASE_NAME || 'houndy.userService.v1.event.'
const EXCHANGE_TYPE = process.env.EXCHANGE_TYPE || 'fanout'
const CONNECTION_RMQ = process.env.CONNECTION_RMQ || 'amqp://localhost'

class IndexBusSend {
  public userAdd = async (user: Iindex) => {
    try {
      if (!user) {
        winstonLogger.error(new RmqError('Sould send a valid user to message queue'))
      }
      const connection = await amqp.connect(CONNECTION_RMQ)
      const exchangeName = EXCHANGE_BASE_NAME + 'index.created'
      const channel = await connection.createChannel()

      channel.assertExchange(exchangeName, EXCHANGE_TYPE, { durable: true })

      const indexDemo:Iindex = { name: 'Hola' }

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
      winstonLogger.error(new RmqError('[RabbitMqEventBus] Error send message to ' + EXCHANGE_BASE_NAME))
    }
  }
}

const indexBusSend = new IndexBusSend()
export default indexBusSend
