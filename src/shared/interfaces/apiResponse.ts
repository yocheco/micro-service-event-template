import { HttpStatusCode } from '../types/http.model'

export interface IApiResponse<T> {
  status: boolean
  code: HttpStatusCode
  message?: string
  data?: T
}
