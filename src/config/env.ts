
export namespace Env{
  // App
  export const NODE_ENV = process.env.ENV || 'dev'
  export const PORT = process.env.PORT || '5000'

  // RMQ
  export const CONNECTION_RMQ = process.env.CONNECTION_RMQ || 'amqp://localhost'
  export const EXCHANGE_TYPE = process.env.EXCHANGE_TYPE || 'fanout'
  export const EXCHANGE_BASE_NAME = process.env.EXCHANGE_BASE_NAME || 'houndy.userService.v1.event.'
}