/* eslint-disable no-useless-constructor */
export class RmqError extends Error {
  constructor ({ message }: { message: string }) {
    super(message)
  }
}

export class RmqErrorCastMessage extends Error {
  constructor ({ message }: { message: string }) {
    super(message)
  }
}

export class RmqConnectionError extends Error {
  constructor ({ message }: { message: string }) {
    super(message)
  }
}
