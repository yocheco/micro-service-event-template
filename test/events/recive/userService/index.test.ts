import indexCreatedReciveBus from '../../../../src/events/recieve/userService/index.created';
import amqp from 'amqplib';
import winstonLogger from '../../../../src/lib/WinstonLogger';
import { mockError, mockInfo } from '../../../shared/mockWinstonLogger';
import { Env } from '../../../../src/config/env';
import testRmq from '../../shared/TestRmq';

// info
const winstonLoggerInfoSpy = jest.spyOn(winstonLogger, 'info')
winstonLoggerInfoSpy.mockImplementation(mockInfo)

// error
const winstonLoggerErrorSpy = jest.spyOn(winstonLogger, 'error')
winstonLoggerErrorSpy.mockImplementation(mockError)

const connectSpy = jest.spyOn(amqp, 'connect')

// RMQ
const eventName = 'index.created'
const queue = 'userService.index.v1.queue.' + eventName
const exchangeName = Env.EXCHANGE_BASE_NAME + eventName

// antes
beforeEach(async () => {
  await indexCreatedReciveBus.start()
})

afterEach(async () => {
  await indexCreatedReciveBus.stop()

  // Clear mock legger
  mockInfo.mockClear()
  connectSpy.mockClear()
  mockError.mockClear()

  // Clear RMQ
  testRmq.clearRmq(exchangeName, queue)
})


describe('Message Broker index bus reciver', () => {
  test('should connect to RMQ', async () => {
    expect(connectSpy).toBeCalledTimes(1)
    expect(mockInfo).toBeCalledTimes(1)
    expect(mockError).not.toHaveBeenCalled()
  });
});