import { SendRmq } from '../../../../src/events/send/sendRmq'
import winstonLogger, { Levels } from '../../../../src/lib/WinstonLogger'
import { mockError, mockInfo } from '../../../shared/mockWinstonLogger'

// info mock
const winstonLoggerInfoSpy = jest.spyOn(winstonLogger, Levels.INFO)
winstonLoggerInfoSpy.mockImplementation(mockInfo)

// error mock
const winstonLoggerErrorSpy = jest.spyOn(winstonLogger, Levels.ERROR)
winstonLoggerErrorSpy.mockImplementation(mockError)

// start send
const sendRmq = new SendRmq()

function delay (ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

describe('Message Broker RBQ send', () => {
  beforeEach(async () => {
    // Clear mocks
    mockInfo.mockClear()
    mockError.mockClear()
  })
  afterEach(async () => {
  })

  test('should connect to RMQ', async () => {
    await sendRmq.send()
    await delay(5)
    await sendRmq.stop()
    expect(mockInfo).toBeCalledTimes(1)
  })

  test('should thow RmqError error to no connection RMQ ', async () => {
    await sendRmq.send('amqp://localhost2')
    await delay(5)
    await sendRmq.stop()
    expect(mockError).toBeCalledTimes(1)
  })
})
