import { exchangeBaseName, SendRmq } from '../../../src/events/send/sendRmq'
import winstonLogger, { Levels } from '../../../src/lib/winstonLogger'
import { mockError, mockInfo } from '../../shared/mockWinstonLogger'
import testRmq from '../shared/TestRmq'

// info mock
const winstonLoggerInfoSpy = jest.spyOn(winstonLogger, Levels.INFO)
winstonLoggerInfoSpy.mockImplementation(mockInfo)

// error mock
const winstonLoggerErrorSpy = jest.spyOn(winstonLogger, Levels.ERROR)
winstonLoggerErrorSpy.mockImplementation(mockError)

// config send
const eventName = 'sendRmq.test'
// start send
const sendRmq = new SendRmq<string>(eventName)

// reciver spy retryCoonection
const retryConnection = jest.spyOn(sendRmq, 'retryConnection')
retryConnection.mockImplementation(() => true)

// start send array
const sendRmqArray = new SendRmq<string[]>(eventName)

function delay (ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

describe('Message Broker RBQ send', () => {
  beforeEach(async () => {
    // Clear mocks
    mockInfo.mockClear()
    mockError.mockClear()
    retryConnection.mockClear()
  })
  afterEach(async () => {
  })

  test('should connect to RMQ', async () => {
    await sendRmq.send()

    await sendRmq.stop()
    expect(mockInfo).toBeCalledTimes(1)
  })

  test('should retry-connection to down RMQ server', async () => {
    await sendRmq.send({ url: 'amqp://localhost2' })

    expect(mockError).toBeCalledTimes(1)
    expect(retryConnection).toBeCalledTimes(1)
  })

  test('should send correct message', async () => {
    await sendRmq.send({ data: 'hola' })
    await delay(10)
    await sendRmq.stop()
    // Clear RMQ
    await testRmq.clearRmq(exchangeBaseName + eventName)

    expect(mockInfo).toBeCalledTimes(2)
  })

  test('should send corret menssage to array', async () => {
    await sendRmqArray.send({ data: ['hola', 'hola'] })
    await delay(10)
    await sendRmqArray.stop()
    // Clear RMQ
    await testRmq.clearRmq(exchangeBaseName + eventName)

    expect(mockInfo).toBeCalledTimes(2)
  })
})
