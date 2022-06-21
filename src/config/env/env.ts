import convict from 'convict'
import path from 'path'

const config = convict({
  env: {
    doc: 'The application environment.',
    format: ['production', 'development', 'test'],
    default: 'development',
    env: 'NODE_ENV'
  },
  port: {
    format: 'int',
    default: 5000,
    env: 'PORT'
  }
})

// Load environment dependent configuration
config.loadFile(path.join(__dirname, `${config.get('env')}.json`))
// Perform validation
config.validate({ allowed: 'strict' })

export namespace Env{
  // App
  export const ENV = config.get('env')
  export const PORT = config.get('port')
  // MONGO
  // dev
  export const MONGOURI = process.env.MONGO || 'mongodb://localhost:27017/mvc'
  // test
  export const MONGOURI_TEST = process.env.MONGO_TEST || 'mongodb://localhost:27017/test'
  // prod
  export const MONGO_USERNAME = process.env.MONGO_USERNAME || 'admin'
  export const MONGO_PASSWORD = process.env.MONGO_PASSWORD || '-Micro$er-'
  export const MONGO_HOSTNAME = process.env.MONGO_HOSTNAME || 'db'
  export const MONGO_PORT = process.env.MONGO_PORT || '27017'
  export const MONGO_DB = process.env.MONGO_DB || 'mvc'

  // RMQ
  // connect
  export const CONNECTION_RMQ: string = process.env.CONNECTION_RMQ || 'amqp://localhost'
  // send
  export const EXCHANGE_TYPE: string = process.env.EXCHANGE_TYPE || 'fanout'
  export const EXCHANGE_BASE_NAME: string = process.env.EXCHANGE_BASE_NAME || 'houndy.userService.v1.event.'
}
