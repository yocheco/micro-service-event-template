import amqp from 'amqplib'
import indexController from '../../../controllers/indexController'

import winstonLogger from '../../../lib/WinstonLogger'
import { ApiError } from '../../../shared/errors/apiError'
import { RmqError } from '../../../shared/errors/rmqError'

const connectionRMQ = process.env.connectionRMQ || 'amqp://localhost'
const exchangeBaseName = process.env.exchangeBaseName || 'houndy.userService.v1.event.'
const eventName = 'index.created'
const exchangeType = process.env.exchangeType || 'fanout'
const exchangeName = exchangeBaseName + eventName
const queue = 'userService.index.v1.queue.' + eventName

class IndexCreatedReciveBus {
  public start = async () => {
    const connection = await amqp.connect(connectionRMQ)
    const channel = await connection.createChannel()
    await channel.assertQueue(queue)
    await channel.assertExchange(exchangeName, exchangeType)
    await channel.bindQueue(queue, exchangeName, '')

    try {
      await channel.consume(queue, async message => {
        if (!message) winstonLogger.error(new RmqError('[RabbitMqEventBus] Sould send a valid message'))
        await indexController.tetsRMQ(message)
        channel.ack(message!)
        winstonLogger.info('[RabbitMqEventBus] Message processed:' + queue)
      }, { noAck: false })
    } catch (error) {
      const message = error instanceof ApiError ? error.message : 'Generic error for user'
      winstonLogger.error(message)
    }
  }
}

const indexCreatedReciveBus = new IndexCreatedReciveBus()
export default indexCreatedReciveBus
