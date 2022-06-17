import { afterEach, beforeEach, describe, expect, jest, test } from '@jest/globals'
import amqp from 'amqplib'

import { Env } from '../../../src/config/env'
import { ReciveRmq } from '../../../src/events/recieve/reciveRmq'
import winstonLogger, { Levels } from '../../../src/lib/WinstonLogger'
import { mockError, mockInfo } from '../../shared/mockWinstonLogger'
import { IMockModel, messageError, messageOk } from '../_mocks_/model'
import { sendControllerMock } from '../_mocks_/sendControllerMock'
import testRmq from '../shared/TestRmq'

// info mock
const winstonLoggerInfoSpy = jest.spyOn(winstonLogger, Levels.INFO)
winstonLoggerInfoSpy.mockImplementation(mockInfo)

// error mock
const winstonLoggerErrorSpy = jest.spyOn(winstonLogger, Levels.ERROR)
winstonLoggerErrorSpy.mockImplementation(mockError)

// amqp Spy
const connectSpy = jest.spyOn(amqp, 'connect')

// Config rmq reciver
const eventName: string = 'index.created'
const queue = 'userService.index.v1.queue.'

// Mock controller
const controllerMock = sendControllerMock

// Init TEST
const exchangeBaseName: string = Env.EXCHANGE_BASE_NAME
const reciveRmq = new ReciveRmq<IMockModel>(exchangeBaseName, eventName, queue, controllerMock)

function delay (ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

describe('Message Broker RBQ reciver', () => {
  beforeEach(async () => {
    // Clear mocks
    mockInfo.mockClear()
    connectSpy.mockClear()
    mockError.mockClear()
  })
  afterEach(async () => {
    // Clear mocks
    mockInfo.mockClear()
    connectSpy.mockClear()
    mockError.mockClear()

    // Clear RMQ
    await testRmq.clearRmq(reciveRmq.exchangeName, reciveRmq.queue)
  })

  test('should connect to RMQ', async () => {
    await reciveRmq.start()
    // await delay(5)
    await reciveRmq.stop()
    expect(connectSpy).toBeCalledTimes(1)
    expect(mockInfo).toBeCalledTimes(1)
  })
  test('should thow RmqError error to no connection RMQ', async () => {
    await reciveRmq.start({ url: 'amqp://localhost2' })
    expect(mockError).toBeCalledTimes(1)
  })

  test('should recived correct message', async () => {
    await reciveRmq.start()
    await testRmq.sendMessage<IMockModel>(reciveRmq.exchangeName, messageOk)

    await delay(5)

    await testRmq.closeConnection()
    await reciveRmq.stop()

    expect(mockInfo).toBeCalledTimes(2)
  })

  test('should thwo RmqErrorCastMessage to send incorrect message', async () => {
    await reciveRmq.start()

    await testRmq.sendMessage<IMockModel>(reciveRmq.exchangeName, messageError)
    await delay(20)

    await testRmq.closeConnection()
    await reciveRmq.stop()

    expect(mockError).toBeCalledTimes(1)
    expect(mockInfo).toBeCalledTimes(1)
  })

  test('should recive 2 corrects messages ', async () => {
    await reciveRmq.start()

    await testRmq.sendMessages<IMockModel>(reciveRmq.exchangeName, [messageOk, messageOk])
    await delay(30)
    await testRmq.closeConnection()
    await reciveRmq.stop()
    expect(mockInfo).toBeCalledTimes(3)
  })

  test('should recive 2 messages 1 correct 1 incorrect', async () => {
    await reciveRmq.start()

    await testRmq.sendMessages<IMockModel>(reciveRmq.exchangeName, [messageOk, messageError])
    await delay(30)
    await testRmq.closeConnection()
    await reciveRmq.stop()

    expect(mockError).toBeCalledTimes(1)
    expect(mockInfo).toBeCalledTimes(2)
  })
})
