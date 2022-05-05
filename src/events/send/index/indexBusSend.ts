import { Iindex } from '../../../models'
import amqp from 'amqplib'
import { IMessageBus } from '../../../shared/interfaces/messageBus'
import winstonLogger from '../../../lib/WinstonLogger'
import { RmqError } from '../../../shared/errors/rmqError'

const exchangeBaseName = process.env.exchangeBaseName || 'houndy.userService.v1.event.'
const exchangeType = process.env.exchangeType || 'fanout'
const connectionRMQ = process.env.connectionRMQ || 'amqp://localhost'

class IndexBusSend {
  public userAdd = async (user: Iindex) => {
    try {
      if (!user) {
        winstonLogger.error(new RmqError('Sould send a valid user to message queue'))
      }
      const connection = await amqp.connect(connectionRMQ)
      const exchangeName = exchangeBaseName + 'index.created'
      const channel = await connection.createChannel()

      channel.assertExchange(exchangeName, exchangeType, { durable: true })

      const message: IMessageBus = {
        data: {
          id: 'sssss',
          occurred: new Date(),
          type: exchangeName,
          attributes: {}
        }
      }

      await channel.publish(exchangeName, '', Buffer.from(JSON.stringify(message)), { persistent: true })
      winstonLogger.info('[RabbitMqEventBus] Message send to: ' + exchangeName)
    } catch (error) {
      winstonLogger.error(new RmqError('[RabbitMqEventBus] Error send message to ' + exchangeBaseName))
    }
  }
}

const indexBusSend = new IndexBusSend()
export default indexBusSend
