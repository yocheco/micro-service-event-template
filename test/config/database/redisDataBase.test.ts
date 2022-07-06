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
})
