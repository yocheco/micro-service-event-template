import { HttpStatusCode } from '../types/http.model'

export interface ApiResponse<T> {
  status: boolean
  code: HttpStatusCode
  message?: string
  data?: T
}
