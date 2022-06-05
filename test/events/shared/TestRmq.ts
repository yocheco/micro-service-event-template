import amqp from 'amqplib'

import { Env } from '../../../src/config/env'

class TestRmq {
  async clearRmq (exchange: string, queue?: string): Promise<void> {
    const connection = await amqp.connect(Env.CONNECTION_RMQ)
    const channel = await connection.createChannel()

    if (queue) await channel.deleteQueue(queue)
    await channel.deleteExchange(exchange)
    connection.close()
  }
}

const testRmq = new TestRmq()
export default testRmq
