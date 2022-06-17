import amqp, { Channel, Connection } from 'amqplib'

import { Env } from '../../../src/config/env'
import { RmqError } from '../../../src/shared/errors/rmqError'
import { IMessageBus } from '../../../src/shared/interfaces/rmq/messageBus'

let connection : Connection
let channel : Channel
class TestRmq {
  private async connectionRmq () {
    try {
      connection = await amqp.connect(Env.CONNECTION_RMQ)
      channel = await connection.createConfirmChannel()
    } catch (error) {
      throw new RmqError('[TestRmq/connectionRmq] Error connect to RMQ')
    }
  }

  public async closeConnection () {
    connection?.close()
  }

  public async clearRmq (exchange: string, queue?: string): Promise<void> {
    const connectionClear = await amqp.connect(Env.CONNECTION_RMQ)
    const channelClear = await connectionClear.createChannel()

    if (queue) await channelClear.deleteQueue(queue)
    await channelClear.deleteExchange(exchange)
    connectionClear?.close()
  }

  public async sendMessage<T> (exchangeName: string, message: IMessageBus<T>) {
    await this.connectionRmq()
    try {
      await channel.publish(exchangeName, '', Buffer.from(JSON.stringify(message)), { persistent: true })
    } catch (error) {
      throw new RmqError('[TestRmq/sendMessage] Error test send message')
    }
  }

  public async sendMessages<T> (exchangeName: string, messages: IMessageBus<T>[]) {
    await this.connectionRmq()
    try {
      messages.forEach(async (message) => {
        await channel.publish(exchangeName, '', Buffer.from(JSON.stringify(message)), { persistent: true })
      })
    } catch (error) {
      throw new RmqError('[TestRmq/sendMessage] Error test send message')
    }
  }
}

const testRmq = new TestRmq()
export default testRmq
