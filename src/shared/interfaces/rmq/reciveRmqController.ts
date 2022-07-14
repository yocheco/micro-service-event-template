import { IMessage } from './messages/Imessage'

export interface IReciveController<T extends IMessage>{
  reciveRMQ: ({ data } : {data: T}) => Promise<boolean>
}
