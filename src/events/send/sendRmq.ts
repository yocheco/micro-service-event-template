import amqp, { Channel, Connection } from 'amqplib'
import { v4 as uuidv4 } from 'uuid'

import { Env } from '../../config/env'
import winstonLogger from '../../lib/WinstonLogger'
import { RmqError } from '../../shared/errors/rmqError'
import { IMessageBus } from '../../shared/interfaces/rmq/messageBus'

let connection: Connection
let channel: Channel

export const exchangeBaseName = Env.EXCHANGE_BASE_NAME
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
      const message = error instanceof Error
        ? `[SendRmq/connectionRmq/] Error connect Rmq to ${exchangeBaseName}${this.eventName} : ${error.message}`
        : `[SendRmq/connectionRmq/] Error connect Rmq to ${exchangeBaseName}${this.eventName}`
      throw new RmqError(message)
    }
  }

  public stop = async (): Promise<void> => {
    try {
      await connection?.close()
    } catch (error) {
      const message = error instanceof Error
        ? `[SendRmq/stop] Error close connection to ${exchangeBaseName}${this.eventName}: ${error.message}`
        : `[SendRmq/stop] Error close connection to ${exchangeBaseName}${this.eventName}`
      winstonLogger.error(message)
    }
  }

  public send = async ({ url = Env.CONNECTION_RMQ, data }:{url?: string, data?: T} = {}): Promise<void> => {
    try {
      await this.connectionRmq(url)
      winstonLogger.info('[SendRmq/send] Connected')

      if (data) await this.publish(data)
    } catch (error) {
      const message = error instanceof Error
        ? `[SendRmq/send] Error send message to ${exchangeBaseName}${this.eventName}: ${error.message}`
        : `[SendRmq/send] Error send message to ${exchangeBaseName}${this.eventName}`
      winstonLogger.error(message)
    }
  }

  private publish = async (data: T) => {
    try {
      const exchangeName = exchangeBaseName + this.eventName
      channel.assertExchange(exchangeName, Env.EXCHANGE_TYPE, { durable: true })

      const message: IMessageBus<T> = {
        data: {
          id: uuidv4(),
          occurred: new Date(),
          type: exchangeName,
          attributes: data
        }
      }

      await channel.publish(exchangeName, '', Buffer.from(JSON.stringify(message)), { persistent: true })
      winstonLogger.info(`[SendRmq/publish] publish to ${exchangeName}`)
    } catch (error) {
      const message = error instanceof Error
        ? `[SendRmq/publish] Error publish message to ${exchangeBaseName}${this.eventName}: ${error.message}`
        : `[SendRmq/publish] Error publish message to ${exchangeBaseName}${this.eventName}`
      winstonLogger.error(message)
    }
  }
}
