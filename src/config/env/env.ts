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
    format: Number,
    default: 5000,
    env: 'PORT'
  },
  rmq: {
    connection: {
      format: String,
      default: 'amqp://localhost',
      env: 'CONNECTION_RMQ'
    },
    exchange: {
      type: {
        format: String,
        default: 'fanout',
        env: 'EXCHANGE_TYPE'
      },
      name: {
        format: String,
        default: 'houndy.userService.v1.event.',
        env: 'EXCHANGE_BASE_NAME'
      }
    }
  },
  mongo: {
    user: {
      format: String,
      default: 'user',
      env: 'MONGO_USERNAME'
    },
    password: {
      format: String,
      default: 'pass',
      env: 'MONGO_PASSWORD'
    },
    host: {
      format: String,
      default: 'localhost',
      env: 'MONGO_HOSTNAME'
    },
    port: {
      format: String,
      default: '27017',
      env: 'MONGO_PORT'
    },
    db: {
      format: String,
      default: 'mvc',
      env: 'MONGO_DB'
    },
    ms: {
      format: Number,
      default: 30000,
      env: 'MONGO_MS_CONNECTION'
    }
  },
  redis: {
    host: {
      format: String,
      default: 'localhost',
      env: 'REDIS_HOSTNAME'
    },
    port: {
      format: Number,
      default: 6379,
      env: 'REDIS_PORT'
    },
    db: {
      format: String,
      default: 'mvc',
      env: 'REDIS_DB'
    },
    ms: {
      format: Number,
      default: 5000,
      env: 'REDIS_MS_CONNECTION'
    }
  }
})

const env = config.get('env')

// Load environment dependent configuration
config.loadFile(path.join(__dirname, `${env}.json`))
// Perform validation
config.validate({ allowed: 'strict' })

function urlDbMongo (): string {
  return (env === 'production')
    ? `mongodb://${config.get('mongo').user}:${config.get('mongo').password}@${config.get('mongo').host}:${config.get('mongo').port}/${config.get('mongo').db}?authSource=admin`
    : `mongodb://${config.get('mongo').host}:${config.get('mongo').port}/${config.get('mongo').db}`
}
export namespace Env{
  // App
  export const ENV = env
  export const PORT = config.get('port')

  // MONGO
  export const MONGO_URI = urlDbMongo()
  export const MONGO_MS_CONNECTION: number = config.get('mongo').ms

  // RMQ
  // connect
  export const CONNECTION_RMQ: string = config.get('rmq').connection
  // send
  export const EXCHANGE_TYPE: string = config.get('rmq').exchange.type
  export const EXCHANGE_BASE_NAME: string = config.get('rmq').exchange.name

  // REDIS
  export const REDIS_HOSTNAME: string = config.get('redis').host
  export const REDIS_PORT: number = config.get('redis').port
  export const REDIS_DB: string = config.get('redis').db
  export const REDIS_MS_CONNECTION: number = config.get('redis').ms
}
