import { HttpStatusCode } from '../types/http.model'

export interface ApiResponse<T> {
  status: HttpStatusCode
  message?: string
  data?: T
}
