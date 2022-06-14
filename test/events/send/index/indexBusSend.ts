
import amqp from 'amqplib'

import { Env } from '../../../../src/config/env'
import indexBusSend from '../../../../src/events/send/index/indexBusSend'
import winstonLogger, { Levels } from '../../../../src/lib/WinstonLogger'
import { Iindex } from '../../../../src/models'
import { RmqError } from '../../../../src/shared/errors/rmqError'
import { mockInfo } from '../../../shared/mockWinstonLogger'
import testRmq from '../../shared/TestRmq'

jest.mock('../../../../src/lib/WinstonLogger')

// info
const winstonLoggerInfoSpy = jest.spyOn(winstonLogger, Levels.INFO)
winstonLoggerInfoSpy.mockImplementation(mockInfo)

const exchangeName = Env.EXCHANGE_BASE_NAME + 'index.created'

const user: Iindex = {
  name: 'test'
}
const connectSpy = jest.spyOn(amqp, 'connect')

// antes
beforeEach(async () => {

})

// despues
afterEach(async () => {
  // Clear RMQ
  testRmq.clearRmq(exchangeName)

  // Clear mock legger
  mockInfo.mockClear()
})

describe('Message Broker index bus send', () => {
  test('should connect to RMQ', async () => {
    // Send rmq user valid
    await indexBusSend.userAdd(user)
    await indexBusSend.closeConnection()

    expect(connectSpy).toBeCalledTimes(1)
    expect(connectSpy).toBeCalledWith(Env.CONNECTION_RMQ)
    expect(mockInfo).toBeCalledTimes(1)
  })

  test('should call error', async () => {
    // Send rmq user valid and invalid url to connection
    await expect(indexBusSend.userAdd(user, 'amqp://localhost2')).rejects.toThrow(RmqError)
    // await indexBusSend.closeConnection()
  })
})
