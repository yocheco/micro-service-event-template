/* eslint-disable no-useless-constructor */
export class ApiError extends Error {
  constructor (message: string) {
    super(message)
  }
}
