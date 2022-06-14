import { IMessageBus } from '../../../src/shared/interfaces/rmq/messageBus'

export interface IMockModel{
  test: string,
  ok: boolean
}

// message ok
export const modelOk : IMockModel = {
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
