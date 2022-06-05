import amqp, { Channel, Connection } from 'amqplib'

import { Env } from '../../../src/config/env'
import { Iindex } from '../../../src/models'
import { RmqError } from '../../../src/shared/errors/rmqError'
import { IMessageBus } from '../../../src/shared/interfaces/messageBus'
import { HttpStatusCode } from '../../../src/shared/types/http.model'

let connection : Connection
let channel : Channel
class TestRmq {
  private async connectionRmq () {
    connection = await amqp.connect(Env.CONNECTION_RMQ)
    channel = await connection.createChannel()
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

  public async sendMessage (exchangeName: string, message: IMessageBus<Iindex>, queue: string) {
    try {
      await this.connectionRmq()
      await channel.assertQueue(queue)
      channel.assertExchange(exchangeName, Env.EXCHANGE_TYPE, { durable: true })
      await channel.bindQueue(queue, exchangeName, '')

      await channel.publish(exchangeName, '', Buffer.from(JSON.stringify(message)), { persistent: true })
      return
    } catch (error) {
      throw new RmqError('[TestRmq] Error test send message', 'start', HttpStatusCode.NOT_FOUND, true)
    }
  }
}

const testRmq = new TestRmq()
export default testRmq
