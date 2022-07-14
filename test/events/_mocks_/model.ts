import { IMessage } from '../../../src/shared/interfaces/rmq/messages/Imessage'
import { IMessageBus } from '../../../src/shared/interfaces/rmq/messages/messageBus'

export interface IMockModel extends IMessage{
  test: string,
  ok: boolean
}

// message ok
export const modelOk : IMockModel = {
  service: 'test',
  ok: true,
  test: ''

}
export const messageOk: IMessageBus<IMockModel> = {
  data: {
    id: '01',
    occurred: new Date(),
    type: '',
    attributes: modelOk
  }
}

// message ok
export const modelError : IMockModel = {
  service: 'test',
  ok: false,
  test: ''

}
export const messageError: IMessageBus<IMockModel> = {
  data: {
    id: '01',
    occurred: new Date(),
    type: '',
    attributes: modelError
  }
}
