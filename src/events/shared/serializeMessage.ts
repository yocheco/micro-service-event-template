
import { ConsumeMessage } from 'amqplib'

import { RmqErrorCastMessage } from '../../shared/errors/rmqError'
import { IMessageBus } from '../../shared/interfaces/rmq/messages/messageBus'

export async function deserializeMessage<T> (message: ConsumeMessage): Promise<T> {
  try {
    const content = await JSON.parse(message.content.toString()) as IMessageBus<T>
    const generic = content.data.attributes as T
    return generic
  } catch (error) {
    throw new RmqErrorCastMessage({ message: '[deserializeMessage] Error to deserializeMessage' })
  }
}
