import amqp, { Channel, Connection } from 'amqplib'

import { Env } from '../../config/env/env'
import winstonLogger from '../../lib/winstonLogger'
import { RmqError } from '../../shared/errors/rmqError'
import { ISendController } from '../../shared/interfaces/rmq/sendRmqController'
import { deserializeMessage } from '../shared/serializeMessage'

// export const eventName = 'index.created'
// export const queue = 'userService.index.v1.queue.' + eventName
// export const exchangeName = Env.EXCHANGE_BASE_NAME + eventName

let connection: Connection
let channel: Channel

export class ReciveRmq<T> {
  public exchangeName: string
  queue: string

  constructor (exchangeBaseName: string, public eventName: string, queueService: string, public controller: ISendController<T>) {
    this.exchangeName = exchangeBaseName + eventName
    this.queue = queueService + eventName
  }

  public start = async ({ url = Env.CONNECTION_RMQ }:{url?: string} = {}): Promise<void> => {
    try {
      await this.connectionRmq({ url })
      await channel.assertQueue(this.queue, { durable: true })
      await channel.assertExchange(this.exchangeName, Env.EXCHANGE_TYPE, { durable: true })
      await channel.bindQueue(this.queue, this.exchangeName, '')
      winstonLogger.info(`[ReciveRmq/connection => ${this.exchangeName}] Connected`)

      // Consume message
      await channel.consume(this.queue, async message => this.consume({ message }), { noAck: false })
    } catch (error) {
      const message = error instanceof Error
        ? `[ReciveRmq/start => ${this.exchangeName}] Error to start: ${error.message}`
        : `[ReciveRmq/start => ${this.exchangeName}] Error to start`
      winstonLogger.error(message)
    }
  }

  public stop = async (): Promise<void> => {
    try {
      await connection?.close()
    } catch (error) {
      const message = error instanceof Error
        ? `[ReciveRmq/stop => ${this.exchangeName}] Error to close connection: ${error.message}`
        : `[ReciveRmq/stop => ${this.exchangeName}] Error to close connection`
      winstonLogger.error(message)
    }
  }

  private connectionRmq = async ({ url }:{url: string}) => {
    try {
      connection = await amqp.connect(url + '?heartbeat=1')
      channel = await connection.createConfirmChannel()
    } catch (error) {
      const message = error instanceof Error
        ? `[ReciveRmq/connectionRmq => ${this.exchangeName}] Error connection: ${error.message}`
        : `[ReciveRmq/connectionRmq => ${this.exchangeName}] Error connection`
      throw new RmqError(message)
    }
  }

  private consume = async ({ message }:{message: amqp.ConsumeMessage|null}) => {
    try {
      if (message == null) throw new RmqError(`[ReciveRmq/consume/${this.eventName}] Error Sould send a valid message`)

      const data = await deserializeMessage<T>(message)

      await this.controller.reciveRMQ({ data })

      channel.ack(message)
      winstonLogger.info(`[ReciveBus/consume => ${this.exchangeName}] Message ack ${this.queue}`)
    } catch (error) {
      const message = error instanceof Error
        ? `[ReciveRmq/consume => ${this.exchangeName}] Error consume: ${error.message}`
        : `[ReciveRmq/consume => ${this.exchangeName}] Error consume`
      winstonLogger.error(message)
    }
  }
}
