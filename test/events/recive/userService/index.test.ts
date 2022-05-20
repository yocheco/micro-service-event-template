import indexCreatedReciveBus from '../../../../src/events/recieve/userService/index.created';
import amqp from 'amqplib';
import winstonLogger from '../../../../src/lib/WinstonLogger';
import { mockError, mockInfo } from '../../../shared/mockWinstonLogger';

// info
const winstonLoggerInfoSpy = jest.spyOn(winstonLogger, 'info')
winstonLoggerInfoSpy.mockImplementation(mockInfo)

// error
const winstonLoggerErrorSpy = jest.spyOn(winstonLogger, 'error')
winstonLoggerErrorSpy.mockImplementation(mockError)

const connectSpy = jest.spyOn(amqp, 'connect')

// antes
beforeEach(async () => {
  await indexCreatedReciveBus.start()
})

afterEach(async () => {
  await indexCreatedReciveBus.stop()

  // Clear mock legger
  mockInfo.mockClear()
  connectSpy.mockClear()
})


describe('Message Broker index bus reciver', () => {
  test('should connect to RMQ', async () => {
    expect(connectSpy).toBeCalledTimes(1)
    expect(mockInfo).toBeCalledTimes(1)
    expect(mockError).not.toHaveBeenCalled()
  });
});