import amqp, { Channel, Connection } from 'amqplib'

import { Env } from '../../config/env'
import winstonLogger from '../../lib/WinstonLogger'
import { RmqError } from '../../shared/errors/rmqError'
import { ISendController } from '../../shared/interfaces/rmq/sendRmqController'
import { deserializeMessage } from '../shared/serializeMessage'

// export const eventName = 'index.created'
// export const queue = 'userService.index.v1.queue.' + eventName
// export const exchangeName = Env.EXCHANGE_BASE_NAME + eventName

let connection: Connection
let channel: Channel

export class ReciveRmq<T> {
  exchangeName: string
  queue: string

  constructor (public eventName: string, queueService: string, public controller: ISendController<T>) {
    this.exchangeName = Env.EXCHANGE_BASE_NAME + eventName
    this.queue = queueService + eventName
  }

  private connectionRmq = async (url: string) => {
    try {
      connection = await amqp.connect(url)
      channel = await connection.createConfirmChannel()
    } catch (error) {
      const message = error instanceof Error ? `[ReciveRmq/connectionRmq/${this.eventName}] Error connection: ${error.message}` : `[ReciveBus/${this.eventName}] Error connection`
      throw new RmqError(message)
    }
  }

  public start = async (url: string = Env.CONNECTION_RMQ): Promise<void> => {
    try {
      await this.connectionRmq(url)
      await channel.assertQueue(this.queue)
      await channel.assertExchange(this.exchangeName, Env.EXCHANGE_TYPE)
      await channel.bindQueue(this.queue, this.exchangeName, '')
      winstonLogger.info(`[ReciveRmq/${this.eventName}] Connected`)

      // Consume message
      await channel.consume(this.queue, async message => this.consume(message), { noAck: false })
    } catch (error) {
      const message = error instanceof Error ? `[ReciveRmq/start/${this.eventName}] Error to consume: ${error.message}` : `[ReciveBus/${this.eventName}] Error to consume`
      winstonLogger.error(message)
    }
  }

  public stop = async (): Promise<void> => {
    try {
      await connection?.close()
    } catch (error) {
      const message = error instanceof Error ? `[ReciveRmq/stop/${this.eventName}] Error to close connection: ${error.message}` : `[ReciveBus/${this.eventName}] Error to close connection`
      winstonLogger.error(message)
    }
  }

  private consume = async (message: amqp.ConsumeMessage|null) => {
    try {
      if (!message) throw new RmqError(`[ReciveRmq/consume/${this.eventName}] Error Sould send a valid message`)

      const data = await deserializeMessage<T>(message!)

      await this.controller.reciveRMQ(data)

      channel.ack(message)
      winstonLogger.info(`[ReciveBus/${this.eventName}] Message processed ${this.queue}`)
    } catch (error) {
      const message = error instanceof Error ? `[ReciveRmq/consume/${this.eventName}] Error to close connection: ${error.message}` : `[ReciveBus/${this.eventName}] Error to close connection`
      winstonLogger.error(message)
    }
  }
}
