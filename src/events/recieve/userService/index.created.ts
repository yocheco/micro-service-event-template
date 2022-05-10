import amqp from 'amqplib'
import indexController from '../../../controllers/indexController'

import winstonLogger from '../../../lib/WinstonLogger'
import { ApiError } from '../../../shared/errors/apiError'
import { RmqError } from '../../../shared/errors/rmqError'

const CONNECTION_RMQ = process.env.CONNECTION_RMQ || 'amqp://localhost'
const EXCHANGE_BASE_NAME = process.env.EXCHANGE_BASE_NAME || 'houndy.userService.v1.event.'
const eventName = 'index.created'
const EXCHANGE_TYPE = process.env.EXCHANGE_TYPE || 'fanout'
const exchangeName = EXCHANGE_BASE_NAME + eventName
const queue = 'userService.index.v1.queue.' + eventName

class IndexCreatedReciveBus {
  public start = async () => {
    try {
      const connection = await amqp.connect(CONNECTION_RMQ)
      const channel = await connection.createChannel()
      await channel.assertQueue(queue)
      await channel.assertExchange(exchangeName, EXCHANGE_TYPE)
      await channel.bindQueue(queue, exchangeName, '')
      winstonLogger.info('[RabbitMqEventBus] Ready')
      await channel.consume(queue, async message => {
        if (!message) winstonLogger.error(new RmqError('[RabbitMqEventBus] Sould send a valid message'))
        await indexController.tetsRMQ(message)
        channel.ack(message!)
        winstonLogger.info('[RabbitMqEventBus] Message processed:' + queue)
      }, { noAck: false })
    } catch (error) {
      const message = error instanceof ApiError ? error.message : '[RabbitMqEventBus] error to conected..'
      winstonLogger.error(message)
    }
  }
}

const indexCreatedReciveBus = new IndexCreatedReciveBus()
export default indexCreatedReciveBus
