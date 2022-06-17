import { jest } from '@jest/globals'

export const mockInfo = jest.fn<(message: string) => void>()
export const mockError = jest.fn<(message: string | Error) => void>()
