/* eslint-disable no-console */
import { App } from './app'

try {
  // eslint-disable-next-line no-unused-expressions
  new App().start()
} catch (error) {
  console.log(error)
  process.exit(1)
}

process.on('uncaughtException', err => {
  console.log('uncaughtException', err)
  process.exit(1)
})
