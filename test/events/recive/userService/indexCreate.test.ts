import amqp from 'amqplib'

import indexCreatedReciveBus, { exchangeName, queue } from '../../../../src/events/recieve/userService/indexCreated'
import winstonLogger from '../../../../src/lib/WinstonLogger'
import { Iindex } from '../../../../src/models'
import { RmqError } from '../../../../src/shared/errors/rmqError'
import { IMessageBus } from '../../../../src/shared/interfaces/messageBus'
import { mockInfo } from '../../../shared/mockWinstonLogger'
import testRmq from '../../shared/TestRmq'

// info
const winstonLoggerInfoSpy = jest.spyOn(winstonLogger, 'info')
winstonLoggerInfoSpy.mockImplementation(mockInfo)

const connectSpy = jest.spyOn(amqp, 'connect')

// message

const indexDemo: Iindex = { name: 'Hola' }
const message: IMessageBus<Iindex> = {
  data: {
    id: 'sssss',
    occurred: new Date(),
    type: exchangeName,
    attributes: indexDemo
  }
}

// antes
beforeEach(async () => {

})

// Despues
afterEach(async () => {
  // Stop recive
  await indexCreatedReciveBus.stop()
  // Clear mock legger
  mockInfo.mockClear()
  connectSpy.mockClear()

  // Clear RMQ
  testRmq.clearRmq(exchangeName, queue)
})

describe('Message Broker index bus reciver', () => {
  test('should connect to RMQ', async () => {
    await indexCreatedReciveBus.start()
    expect(connectSpy).toBeCalledTimes(1)
    expect(mockInfo).toBeCalledTimes(1)
  })

  test('should throw error connection', async () => {
    await expect(indexCreatedReciveBus.start('amqp://localhost2')).rejects.toThrow(RmqError)
  })

  test('should recive correct message', async () => {
    await testRmq.sendMessage(exchangeName, message, queue)
    await indexCreatedReciveBus.start()

    await testRmq.closeConnection()

    expect(mockInfo).toBeCalledTimes(2)
  })
})
