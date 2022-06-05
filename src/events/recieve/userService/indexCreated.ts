import amqp, { Channel, Connection } from 'amqplib'

import { Env } from '../../../config/env'
import indexController from '../../../controllers/indexController'
import winstonLogger from '../../../lib/WinstonLogger'
import { Iindex } from '../../../models'
import { ApiError } from '../../../shared/errors/apiError'
import { RmqError } from '../../../shared/errors/rmqError'
import { HttpStatusCode } from '../../../shared/types/http.model'
import { deserializeMessage } from '../../shared/serializeMessage'

export const eventName = 'index.created'
export const queue = 'userService.index.v1.queue.' + eventName
export const exchangeName = Env.EXCHANGE_BASE_NAME + eventName

let connection: Connection
let channel: Channel

class IndexCreatedReciveBus {
  private connectionRmq = async (url: string) => {
    try {
      connection = await amqp.connect(url)
      channel = await connection.createChannel()
    } catch (error) {
      throw new RmqError('[IndexCreatedReciveBus] Error connection', 'connectionRmq', HttpStatusCode.NOT_FOUND, true)
    }
  }

  public start = async (url: string = Env.CONNECTION_RMQ): Promise<void> => {
    await this.connectionRmq(url)
    try {
      await channel.assertQueue(queue)
      await channel.assertExchange(exchangeName, Env.EXCHANGE_TYPE)
      await channel.bindQueue(queue, exchangeName, '')
      winstonLogger.info('[RabbitMqEventBus] Ready')

      await channel.consume(queue, async message => {
        if (!message) winstonLogger.error(new RmqError('[RabbitMqEventBus] Sould send a valid message'))

        const index = await deserializeMessage<Iindex>(message!)

        indexController.reciveRMQ(index)
        channel.ack(message!)
        winstonLogger.info('[IndexCreatedReciveBus] Message processed:' + queue)
      }, { noAck: false })
    } catch (error) {
      throw new RmqError('[IndexCreatedReciveBus] Error consume', 'start', HttpStatusCode.NOT_FOUND, true)
    }
  }

  public stop = async (): Promise<void> => {
    try {
      await connection?.close()
    } catch (error) {
      const message = error instanceof ApiError ? error.message : '[RabbitMqEventBus] error to desconnect..'
      winstonLogger.error(message)
    }
  }
}

const indexCreatedReciveBus = new IndexCreatedReciveBus()
export default indexCreatedReciveBus
