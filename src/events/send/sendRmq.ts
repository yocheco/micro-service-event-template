import amqp, { Channel, Connection } from 'amqplib'

import { Env } from '../../config/env'
import winstonLogger from '../../lib/WinstonLogger'
import { RmqError } from '../../shared/errors/rmqError'

let connection: Connection
let channel: Channel

export class SendRmq {
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

  public send = async (url: string = Env.CONNECTION_RMQ) => {
    try {
      await this.connectionRmq(url)
      winstonLogger.info('[SendRmq/] Connected')
    } catch (error) {
      const message = error instanceof Error ? `[SendRmq/send] : ${error.message}` : '[SendRmq/send] Error to send message'
      winstonLogger.error(message)
    }
  }
}
