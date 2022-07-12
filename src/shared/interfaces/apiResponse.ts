import { HttpStatusCode } from '../types/http.model'

export interface IApiResponseError{
  message: string
  erros?: string[]
}

export interface IApiResponse<T={}> {
  status: boolean
  code: HttpStatusCode
  message?: string
  data?: T
  error?: IApiResponseError
}
