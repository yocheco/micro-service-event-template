import amqp, { Connection } from 'amqplib'

import { Env } from '../../../config/env'
import indexController from '../../../controllers/indexController'
import winstonLogger from '../../../lib/WinstonLogger'
import { ApiError } from '../../../shared/errors/apiError'
import { RmqError } from '../../../shared/errors/rmqError'

const eventName = 'index.created'
const queue = 'userService.index.v1.queue.' + eventName
const exchangeName = Env.EXCHANGE_BASE_NAME + eventName

let connection: Connection

class IndexCreatedReciveBus {
  public start = async () => {
    try {
      connection = await amqp.connect(Env.CONNECTION_RMQ)
      const channel = await connection.createChannel()
      await channel.assertQueue(queue)
      await channel.assertExchange(exchangeName, Env.EXCHANGE_TYPE)
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

  public stop = async () => {
    try {
      await connection.close()
    } catch (error) {
      const message = error instanceof ApiError ? error.message : '[RabbitMqEventBus] error to desconnect..'
      winstonLogger.error(message)
    }
  }
}

const indexCreatedReciveBus = new IndexCreatedReciveBus()
export default indexCreatedReciveBus
