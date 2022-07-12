/* eslint-disable no-useless-constructor */
export class ApiError extends Error {
  constructor ({ message }: { message: string }) {
    super(message)
  }
}
