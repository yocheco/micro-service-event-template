import amqp, { Channel, Connection } from 'amqplib'

import { Env } from '../../config/env'
import winstonLogger from '../../lib/WinstonLogger'
import { BaseError } from '../../shared/errors/baseError'
import { RmqError, RmqErrorCastMessage } from '../../shared/errors/rmqError'
import { ISendController } from '../../shared/interfaces/rmq/sendRmqController'
import { HttpStatusCode } from '../../shared/types/http.model'
import { deserializeMessage } from '../shared/serializeMessage'

// export const eventName = 'index.created'
// export const queue = 'userService.index.v1.queue.' + eventName
// export const exchangeName = Env.EXCHANGE_BASE_NAME + eventName

let connection: Connection
let channel: Channel

export class ReciveRmq<T> {
  exchangeName: string
  queue: string

  constructor (eventName: string, queueService: string, public controller: ISendController<T>) {
    this.exchangeName = Env.EXCHANGE_BASE_NAME + eventName
    this.queue = queueService + eventName
  }

  private connectionRmq = async (url: string) => {
    try {
      connection = await amqp.connect(url)
      channel = await connection.createConfirmChannel()
    } catch (error) {
      const message = error instanceof Error ? '[ReciveBus] Error connection' + error.message : '[ReciveBus] Error connection'

      throw new RmqError(message, 'connectionRmq', HttpStatusCode.NOT_FOUND, true)
    }
  }

  public start = async (url: string = Env.CONNECTION_RMQ): Promise<void> => {
    try {
      await this.connectionRmq(url)
      await channel.assertQueue(this.queue)
      await channel.assertExchange(this.exchangeName, Env.EXCHANGE_TYPE)
      await channel.bindQueue(this.queue, this.exchangeName, '')
      winstonLogger.info('[RabbitMqEventBus] Ready')

      channel.consume(this.queue, async message => {
        if (!message) winstonLogger.error(new RmqError('[IndexCreatedReciveBus] Sould send a valid message'))

        const index = await deserializeMessage<T>(message!)

        const error = await this.controller.reciveRMQ(index)

        if (error) {
          winstonLogger.error(error)
          throw error
        }

        channel.ack(message!)
        winstonLogger.info('[IndexCreatedReciveBus] Message processed:' + this.queue)
      }, { noAck: false }
      )
    } catch (error) {
      const message = error instanceof BaseError ? error.message : '[IndexCreatedReciveBus] error to consume..'
      winstonLogger.error(new RmqError(message + ' Error consume', 'start', HttpStatusCode.NOT_FOUND, true))
    }
  }

  public stop = async (): Promise<void> => {
    try {
      await connection?.close()
    } catch (error) {
      const message = error instanceof BaseError ? error.message : '[IndexCreatedReciveBus] error to desconnect..'
      winstonLogger.error(message)
    }
  }
}
