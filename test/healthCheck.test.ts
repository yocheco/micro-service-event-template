import request from 'supertest'
import { App } from '../src/app'

let application: App

beforeEach(async () => {
  application = new App()
  await application.start()
})

afterEach(async () => {
  await application.stop()
})

// eslint-disable-next-line no-undef
describe('Get /health-check', () => {
  test('should return 200', async () => {
    await request(application.httpServer)
      .get('/health-check')
      .expect(201)
  })
})
