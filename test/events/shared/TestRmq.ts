import amqp, { Channel, Connection } from 'amqplib'

import { Env } from '../../../src/config/env'
import { RmqError } from '../../../src/shared/errors/rmqError'
import { IMessageBus } from '../../../src/shared/interfaces/rmq/messageBus'
import { HttpStatusCode } from '../../../src/shared/types/http.model'

let connection : Connection
let channel : Channel
class TestRmq {
  private async connectionRmq () {
    try {
      connection = await amqp.connect(Env.CONNECTION_RMQ)
      channel = await connection.createConfirmChannel()
    } catch (error) {
      console.log(error)
      console.log('bugggggg')
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
      throw new RmqError('[TestRmq] Error test send message', 'start', HttpStatusCode.NOT_FOUND, true)
    }
  }
}

const testRmq = new TestRmq()
export default testRmq
