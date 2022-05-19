
import { describe, expect, test, beforeEach, afterEach, jest } from '@jest/globals'
import amqp from 'amqplib';
import { Env } from '../../../../src/config/env'
import indexBusSend from '../../../../src/events/send/index/indexBusSend'
import { Iindex } from '../../../../src/models'

jest.mock('../../../../src/lib/WinstonLogger')
import winstonLogger from '../../../../src/lib/WinstonLogger'
const mockInfo =  jest.fn<(message: string) => void>()
const mockError =  jest.fn<(message: string | Error) => void>()

// info
const winstonLoggerInfoSpy = jest.spyOn(winstonLogger, 'info')
winstonLoggerInfoSpy.mockImplementation(mockInfo)

// error
const winstonLoggerErrorSpy = jest.spyOn(winstonLogger, 'error')
winstonLoggerErrorSpy.mockImplementation(mockError)



const exchangeName = Env.EXCHANGE_BASE_NAME + 'index.created'
const connectionUrl = Env.CONNECTION_RMQ
const user: Iindex = {
 name:'test'
}



// antes
beforeEach(async () => {
  

})

// despues
afterEach(async () => {
  const connection = await amqp.connect(Env.CONNECTION_RMQ)
  const channel = await connection.createChannel()
  await channel.deleteExchange(exchangeName)
  connection.close()

  // Clear mock legger
  mockError.mockClear()
  mockInfo.mockClear()
})

describe('Message Broker index bus send', () => {
  test('should connect to RMQ', async () => {
    const connectSpy = jest.spyOn(amqp, 'connect')
    await indexBusSend.userAdd(user)
    expect(connectSpy).toBeCalledTimes(1)
    expect(connectSpy).toBeCalledWith(Env.CONNECTION_RMQ)
  })

  test('should no Error', () => {
    expect(mockError).not.toHaveBeenCalled()
  });
  
  test('should call loger info to ok send to RMQ', async() => {
    await indexBusSend.userAdd(user)
    expect(mockInfo).toBeCalledTimes(1)
  });
})
