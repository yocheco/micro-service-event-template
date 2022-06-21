import mongoose from 'mongoose'

import { MongoDb } from '../../../src/config/dataBase/dataBase'
import winstonLogger, { Levels } from '../../../src/lib/winstonLogger'
import { mockError, mockInfo } from '../../shared/mockWinstonLogger'

// info mock
const winstonLoggerInfoSpy = jest.spyOn(winstonLogger, Levels.INFO)
winstonLoggerInfoSpy.mockImplementation(mockInfo)

// error mock
const winstonLoggerErrorSpy = jest.spyOn(winstonLogger, Levels.ERROR)
winstonLoggerErrorSpy.mockImplementation(mockError)

// mongo Spy
const mongoConnectSpy = jest.spyOn(mongoose, 'connect')

// MongoseDb
const mongoDb = new MongoDb()

describe('Mongo connection', () => {
  beforeEach(async () => {
    // Clear mocks
    mockInfo.mockClear()
    mongoConnectSpy.mockClear()
    mockError.mockClear()
  })
  afterEach(async () => {
    // Clear mocks
    mockInfo.mockClear()
    mongoConnectSpy.mockClear()
    mockError.mockClear()
  })
  test('should connect correct to mongo db', async () => {
    await mongoDb.start()
    await mongoDb.stop()

    expect(mongoConnectSpy).toBeCalledTimes(1)
    expect(mockInfo).toBeCalledTimes(1)
    expect(mockError).not.toBeCalled()
  })

  test('should no connected and log error to url incorrected', async () => {
    await mongoDb.start({ url: '//utp' })

    expect(mongoConnectSpy).toBeCalledTimes(1)
    expect(mockError).toBeCalledTimes(1)
    expect(mockInfo).not.toBeCalled()
  })
})
