
import request from 'supertest'

import { App } from '../src/app'
import winstonLogger from '../src/lib/winstonLogger'
import { mockError, mockInfo } from './shared/mockWinstonLogger'

let application: App

// info
const winstonLoggerInfoSpy = jest.spyOn(winstonLogger, 'info')
winstonLoggerInfoSpy.mockImplementation(mockInfo)

beforeEach(async () => {
  application = new App()
  await application.start()

  // Clear mock legger
  mockError.mockClear()
  mockInfo.mockClear()
})

afterEach(async () => {
  await application.stop()

  // Clear mock legger
  mockError.mockClear()
  mockInfo.mockClear()
})

describe('Get /health-check', () => {
  test('should return 200', async () => {
    await request(application.httpServer)
      .get('/health-check')
      .expect(200)
  })
})
