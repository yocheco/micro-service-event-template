
import { ConsumeMessage } from 'amqplib'

import { RmqErrorCastMessage } from '../../shared/errors/rmqError'
import { IMessageBus } from '../../shared/interfaces/messageBus'

export async function deserializeMessage<T> (message: ConsumeMessage): Promise<T> {
  try {
    const content = await JSON.parse(message.content.toString()) as IMessageBus<T>

    return content.data.attributes as T
  } catch (error) {
    throw new RmqErrorCastMessage('[deserializeMessage] Error to deserializeMessage')
  }
}
