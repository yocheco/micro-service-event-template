/* eslint-disable no-unused-vars */
/* eslint-disable global-require */


import { describe, expect, test } from '@jest/globals'

import { IMessageBus } from '../../../../../userService/src/shared/interfaces/messageBus'
import { IDataBus } from '../../../../src/shared/interfaces/messageBus';

const message: IMessageBus = {
  data: {
    id: 'sssss',
    occurred: new Date('December 17, 1995 03:24:00'),
    type: '',
    attributes: {
      index: ''
    }
  }
}


beforeEach(async () => {

})

afterEach(async () => {

})


describe('Message Broker Connection in index bus send', () => {
  test('should connect to RMQ', () => {

  })
})
