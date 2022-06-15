export interface ISendController<T>{
  reciveRMQ: (data:T) => void
}
