import mongoose from 'mongoose'

import { MongoDb } from '../../../src/config/dataBase/mongoDataBase'
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

// Retry Coonection mongo Spy
const retryConnection = jest.spyOn(mongoDb, 'retryConnection')
retryConnection.mockImplementation(() => true)

describe('Mongo connection', () => {
  beforeEach(async () => {
    // Clear mocks info
    mockInfo.mockClear()
    mockError.mockClear()
    // Crear moks mongo
    mongoConnectSpy.mockClear()
    retryConnection.mockClear()
  })

  afterEach(async () => {
  })

  test('should connect correct to mongo db', async () => {
    await mongoDb.start()
    await mongoDb.stop()

    expect(mongoConnectSpy).toBeCalledTimes(1)
    expect(mockInfo).toBeCalledTimes(1)
    expect(mockError).not.toBeCalled()
  })

  test('should retry connection to error in server to mongodb', async () => {
    await mongoDb.start({ url: 'mongodb://localhost:11/dc' })

    expect(mongoConnectSpy).toBeCalledTimes(1)
    expect(mockError).toBeCalledTimes(1)
    expect(mockInfo).not.toBeCalled()
    expect(retryConnection).toBeCalledTimes(1)
  })
})
