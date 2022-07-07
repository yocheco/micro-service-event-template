import { describe } from '@jest/globals'
import * as redis from 'redis'

import { RedisDb } from '../../../src/config/dataBase/redisDataBase'
import winstonLogger, { Levels } from '../../../src/lib/winstonLogger'
import { mockError, mockInfo } from '../../shared/mockWinstonLogger'

// info mock
const winstonLoggerInfoSpy = jest.spyOn(winstonLogger, Levels.INFO)
winstonLoggerInfoSpy.mockImplementation(mockInfo)

// error mock
const winstonLoggerErrorSpy = jest.spyOn(winstonLogger, Levels.ERROR)
winstonLoggerErrorSpy.mockImplementation(mockError)

// Redis
const redisDb = new RedisDb()

// redis Spy
const redisConnectSpy = jest.spyOn(redis, 'createClient')

// Retry Coonection redis Spy
const retryConnection = jest.spyOn(redisDb, 'retryConnection')
retryConnection.mockImplementation()

describe('Redis connection', () => {
  beforeEach(async () => {
    // Clear mocks info
    mockInfo.mockClear()
    mockError.mockClear()
    // Crear moks redis
    redisConnectSpy.mockClear()
  })

  afterEach(async () => {
  })

  test('should connect correct to [Redis] db', async () => {
    await redisDb.start()

    await redisDb.stop()

    expect(redisConnectSpy).toBeCalledTimes(1)
    expect(mockInfo).toBeCalledTimes(1)
    expect(mockError).not.toBeCalled()
  })

  test('should retry connection to error in server to Redis', async () => {
    await redisDb.start({ port: 30 })

    expect(redisConnectSpy).toBeCalledTimes(1)
    expect(mockError).toBeCalledTimes(1)
    expect(mockInfo).not.toBeCalled()
    expect(retryConnection).toBeCalledTimes(1)
  })
})
