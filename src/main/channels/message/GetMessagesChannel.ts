import { instanceToPlain } from 'class-transformer';
import { IpcMainEvent } from 'electron';
import log from 'electron-log/main';

import { GET_MESSAGES_CHANNEL } from '../../../shared/channels';
import { IpcRequest } from '../../../shared/interfaces/IpcRequest';
import { AppDataSource } from '../../data-source';
import { Message } from '../../entity/Message';
import { IpcChannel } from '../../interfaces/IpcChannel';

export class GetMessagesChannel implements IpcChannel {
  getName(): string {
    return GET_MESSAGES_CHANNEL;
  }

  async handle(event: IpcMainEvent, request: IpcRequest): Promise<void> {
    // debug
    log.debug(`handling ${this.getName()}...`);

    if (!request.responseChannel) {
      request.responseChannel = `${this.getName()}:response`;
    }

    const { conversationId } = request.params;

    // debug
    log.debug(`getting messages for conversation:`, conversationId);

    const messageRepository = AppDataSource.getRepository(Message);
    const messages = await messageRepository.findBy({
      conversation: { id: conversationId },
    });

    // debug
    log.debug(`got messages:`, messages);

    event.sender.send(request.responseChannel, instanceToPlain(messages));
  }
}
