import amqp, { ConfirmChannel, Connection } from 'amqplib'
import { v4 as uuidv4 } from 'uuid'

import { Env } from '../../config/env/env'
import { backOff } from '../../lib/backOff'
import winstonLogger from '../../lib/winstonLogger'
import { RmqConnectionError } from '../../shared/errors/rmqError'
import { IMessage } from '../../shared/interfaces/rmq/messages/Imessage'
import { IMessageBus } from '../../shared/interfaces/rmq/messages/messageBus'

let connection: Connection
let channel: ConfirmChannel

export const exchangeBaseName = Env.EXCHANGE_BASE_NAME
// export const eventName = 'index.created'

export class SendRmq<T extends IMessage> {
   public eventName: string
   constructor (eventName:string) {
     this.eventName = eventName
   }

   private connectionRmq = async ({ url }: { url: string }) => {
     try {
       connection = await amqp.connect(url)
       channel = await connection.createConfirmChannel()
     } catch (error) {
       const message = error instanceof Error
         ? `[SendRmq] Error connect Rmq to ${exchangeBaseName}${this.eventName} : ${error.message}`
         : `[SendRmq] Error connect Rmq to ${exchangeBaseName}${this.eventName}`
       throw new RmqConnectionError({ message: message })
     }
   }

   private publish = async ({ data }: { data: T }) => {
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
       await channel.waitForConfirms()
       winstonLogger.info(`[SendRmq] publish to ${exchangeName}`)
       // stop connection after send event
       await this.stop()
     } catch (error) {
       const message = error instanceof Error
         ? `[SendRmq] Error publish message to ${exchangeBaseName}${this.eventName}: ${error.message}`
         : `[SendRmq] Error publish message to ${exchangeBaseName}${this.eventName}`
       winstonLogger.error(message)
     }
   }

  // Public Send
  public send = async ({ url = Env.CONNECTION_RMQ, data }: { url?: string, data?: T } = {}): Promise<void> => {
    try {
      await this.connectionRmq({ url })
      winstonLogger.info('[SendRmq] Connected')
      // Publish message
      if (data) await this.publish({ data })
    } catch (error) {
      // catch error to connection
      if (error instanceof RmqConnectionError) {
        this.retryConnection({ url, data })
      }
      const message = error instanceof Error
        ? `[SendRmq] Error send message to ${exchangeBaseName}${this.eventName}: ${error.message}`
        : `[SendRmq] Error send message to ${exchangeBaseName}${this.eventName}`
      winstonLogger.error(message)
    }
  }

  public retryConnection ({ url, data }: { url?: string, data?: T } = {}) {
    setTimeout(() => {
      this.send({ url, data })
    }, backOff.calculateBackOffDelayMs(20))
    winstonLogger.info('[SendRmq] Retry connection to Rmq')
  }

  // Public Stop
  public stop = async (): Promise<void> => {
    try {
      await connection?.close()
    } catch (error) {
      const message = error instanceof Error
        ? `[SendRmq] Error close connection to ${exchangeBaseName}${this.eventName}: ${error.message}`
        : `[SendRmq] Error close connection to ${exchangeBaseName}${this.eventName}`
      winstonLogger.error(message)
    }
  }
}
