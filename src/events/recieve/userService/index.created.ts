import amqp from 'amqplib'
import indexController from '../../../controllers/indexController'
import { BaseError } from '../../../shared/errors/base'

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
      console.log('init consumer')
      await channel.consume(queue, async message => {
        if (!message) {
          throw new BaseError('RabbitMqEventBus has not being properly initialized, deserializer is missing')
        }
        await indexController.tetsRMQ(message)
        channel.ack(message)
      }, { noAck: false })
      console.log('finish consumer')
    } catch (error) {
      console.log(error)
      console.log('----------------------errorororor--------------')
    }
  }
}

const indexCreatedReciveBus = new IndexCreatedReciveBus()
export default indexCreatedReciveBus
