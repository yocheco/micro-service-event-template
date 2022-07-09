export interface IReciveController<T>{
  reciveRMQ: ({ data } : {data: T}) => Promise<boolean>
}
