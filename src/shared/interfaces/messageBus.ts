
export interface IDataBus{
  id: string
  type: string
  occurred: Date
  attributes: any
}

export interface IMessageBus{
  data: IDataBus
  meta?: any
}
