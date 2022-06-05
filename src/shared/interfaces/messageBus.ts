
export interface IDataBus<T>{
  id: string
  type: string
  occurred: Date
  attributes: T
}

export interface IMessageBus<T>{
  data: IDataBus<T>
  meta?: any
}
