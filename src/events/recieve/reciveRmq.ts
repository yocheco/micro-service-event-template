import amqp, { Channel, Connection } from 'amqplib'

import { Env } from '../../config/env/env'
import { backOff } from '../../lib/backOff'
import winstonLogger from '../../lib/winstonLogger'
import { RmqConnectionError, RmqError } from '../../shared/errors/rmqError'
import { IMessage } from '../../shared/interfaces/rmq/messages/Imessage'
import { IReciveController } from '../../shared/interfaces/rmq/reciveRmqController'
import { deserializeMessage } from '../shared/serializeMessage'

// export const eventName = 'index.created'
// export const queue = 'userService.index.v1.queue.' + eventName
// export const exchangeName = Env.EXCHANGE_BASE_NAME + eventName

let connection: Connection
let channel: Channel

export class ReciveRmq<T extends IMessage> {
  public exchangeName: string
  public queue: string

  constructor (exchangeBaseName: string, public eventName: string, queueService: string, public controller: IReciveController<T>) {
    this.exchangeName = exchangeBaseName + eventName
    this.queue = queueService + eventName
  }

  private connectionRmq = async ({ url }:{url: string}) => {
    try {
      connection = await amqp.connect(url + '?heartbeat=1')
      channel = await connection.createConfirmChannel()
      channel.prefetch(5)

      // Lost connection to Rmq
      channel.on('close', () => {
        this.retryConnection()
      })
    } catch (error) {
      const message = error instanceof Error
        ? `[ReciveRmq] => ${this.exchangeName} Error connection: ${error.message}`
        : `[ReciveRmq] => ${this.exchangeName} Error connection`
      throw new RmqConnectionError({ message: message })
    }
  }

  private consume = async ({ message }:{message: amqp.ConsumeMessage|null}) => {
    try {
      if (message == null) throw new RmqError({ message: `[ReciveRmq] consume/${this.eventName} Error Sould send a valid message` })

      const data = await deserializeMessage<T>(message)

      // send data message to controller
      const response:boolean = await this.controller.reciveRMQ({ data })

      // return message to queue
      if (!response) {
        // await channel.nack(message)
        throw new RmqError({ message: `[ReciveRmq] consume/${this.eventName} Error: Controller no ack message` })
      }

      channel.ack(message)
      winstonLogger.info(`[ReciveBus] consume => ${this.exchangeName} Message ack ${this.queue}`)
    } catch (error) {
      const message = error instanceof Error
        ? `[ReciveRmq] consume => ${this.exchangeName} Error consume: ${error.message}`
        : `[ReciveRmq] consume => ${this.exchangeName} Error consume`
      winstonLogger.error(message)
    }
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
      // catch error to connection
      if (error instanceof RmqConnectionError) {
        this.retryConnection()
      }
      const message = error instanceof Error
        ? `[ReciveRmq] => ${this.exchangeName} Error to start: ${error.message}`
        : `[ReciveRmq] => ${this.exchangeName} Error to start`
      winstonLogger.error(message)
    }
  }

  public stop = async (): Promise<void> => {
    try {
      await connection?.close()
    } catch (error) {
      const message = error instanceof Error
        ? `[ReciveRmq] => ${this.exchangeName} Error to close connection: ${error.message}`
        : `[ReciveRmq] => ${this.exchangeName} Error to close connection`
      winstonLogger.error(message)
    }
  }

  public retryConnection () {
    backOff.delay(this.start, 20)
    winstonLogger.info(`[ReciveRmq] => ${this.exchangeName} Retry connection to Rmq`)
  }
}
