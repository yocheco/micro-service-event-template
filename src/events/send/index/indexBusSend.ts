import amqp, { Channel, Connection } from 'amqplib'

import { Env } from '../../../config/env'
import winstonLogger from '../../../lib/WinstonLogger'
import { Iindex } from '../../../models'
import { RmqError } from '../../../shared/errors/rmqError'
import { IMessageBus } from '../../../shared/interfaces/rmq/messageBus'
import { HttpStatusCode } from '../../../shared/types/http.model'

let connection: Connection
let channel: Channel
class IndexBusSend {
  private connectionRmq = async (url: string | amqp.Options.Connect, socketOptions?: any) => {
    try {
      connection = await amqp.connect(url)
      channel = await connection.createChannel()
    } catch (error) {
      throw new RmqError('[IndexBusSend] Error connection', 'connectionRmq', HttpStatusCode.NOT_FOUND, true)
    }
  }

  public closeConnection = async () => {
    connection?.close()
  }

  public userAdd = async (user: Iindex, url: string = Env.CONNECTION_RMQ) => {
    if (!user) {
      throw new RmqError('[IndexBusSend] Sould send a valid user to message queue', 'userAdd', HttpStatusCode.BAD_REQUEST, true)
    }

    await this.connectionRmq(url)

    try {
      const exchangeName = Env.EXCHANGE_BASE_NAME + 'index.created'
      channel.assertExchange(exchangeName, Env.EXCHANGE_TYPE, { durable: true })
      const indexDemo: Iindex = { name: 'Hola' }
      const message: IMessageBus<Iindex> = {
        data: {
          id: 'sssss',
          occurred: new Date(),
          type: exchangeName,
          attributes: indexDemo
        }
      }

      await channel.publish(exchangeName, '', Buffer.from(JSON.stringify(message)), { persistent: true })
      winstonLogger.info('[RabbitMqEventBus] Message send to: ' + exchangeName)
    } catch (error) {
      throw new RmqError('[IndexBusSend] Error send message to RMQ', 'userAdd', HttpStatusCode.INTERNAL_SERVER, true)
    }
  }
}

const indexBusSend = new IndexBusSend()
export default indexBusSend
