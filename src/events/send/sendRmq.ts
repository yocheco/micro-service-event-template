import amqp, { Channel, Connection } from 'amqplib'

import { Env } from '../../config/env'
import winstonLogger from '../../lib/WinstonLogger'
import { RmqError } from '../../shared/errors/rmqError'
import { IMessageBus } from '../../shared/interfaces/rmq/messageBus'

let connection: Connection
let channel: Channel

export const exchangeName = Env.EXCHANGE_BASE_NAME
// export const eventName = 'index.created'

export class SendRmq<T> {
   public eventName: string
   constructor (eventName:string) {
     this.eventName = eventName
   }

  private connectionRmq = async (url: string) => {
    try {
      connection = await amqp.connect(url)
      channel = await connection.createConfirmChannel()
    } catch (error) {
      const message = error instanceof Error ? `[SendRmq/connectionRmq/] Error connection: ${error.message}` : '[ReciveBus] Error connection'
      throw new RmqError(message)
    }
  }

  public stop = async (): Promise<void> => {
    try {
      await connection?.close()
    } catch (error) {
      const message = error instanceof Error ? `[SendRmq/stop] Error to close connection: ${error.message}` : '[SendRmq/stop] Error to close connection'
      winstonLogger.error(message)
    }
  }

  public send = async ({ url, data }:{url?: string, data?: T} = {}): Promise<void> => {
    if (!url) url = Env.CONNECTION_RMQ
    try {
      await this.connectionRmq(url)
      winstonLogger.info('[SendRmq/send] Connected')

      if (data) await this.publish(data)
    } catch (error) {
      const message = error instanceof Error ? `[SendRmq/send] : ${error.message}` : '[SendRmq/send] Error to send message'
      winstonLogger.error(message)
    }
  }

  private publish = async (data: T) => {
    try {
      const exchangeName = Env.EXCHANGE_BASE_NAME + this.eventName
      channel.assertExchange(exchangeName, Env.EXCHANGE_TYPE, { durable: true })

      const message: IMessageBus<T> = {
        data: {
          id: 'sssss',
          occurred: new Date(),
          type: exchangeName,
          attributes: data
        }
      }

      await channel.publish(exchangeName, '', Buffer.from(JSON.stringify(message)), { persistent: true })
      winstonLogger.info('[SendRmq/publish] publish')
    } catch (error) {

    }
  }
}
