import { Iindex } from '../../../models'
import { BaseError } from '../../../shared/errors/baseError'
import amqp from 'amqplib'
import { IMessageBus } from '../../../shared/interfaces/messageBus'

const exchangeBaseName = process.env.exchangeBaseName || 'houndy.userService.v1.event.'
const exchangeType = process.env.exchangeType || 'fanout'
const connectionRMQ = process.env.connectionRMQ || 'amqp://localhost'

class IndexBusSend {
  public userAdd = async (user: Iindex) => {
    try {
      if (!user) throw new BaseError('Sould send a valid user to message queue', 'Sould send a valid user to message queue', 'user.add')
      console.log('Send message to RMQ')
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
    } catch (error) {
      console.log(error)
    }
  }
}

const indexBusSend = new IndexBusSend()
export default indexBusSend
