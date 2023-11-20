import { instanceToPlain } from 'class-transformer';
import { IpcMainEvent } from 'electron';
import log from 'electron-log/main';

import { DELETE_CONVERSATION_CHANNEL } from '../../../shared/channels';
import { IpcRequest } from '../../../shared/interfaces/IpcRequest';
import { AppDataSource } from '../../data-source';
import { Conversation } from '../../entity/Conversation';
import { IpcChannel } from '../../interfaces/IpcChannel';

export class DeleteConversationChannel implements IpcChannel {
  getName(): string {
    return DELETE_CONVERSATION_CHANNEL;
  }

  async handle(event: IpcMainEvent, request: IpcRequest): Promise<void> {
    if (!request.responseChannel) {
      request.responseChannel = `${this.getName()}:response`;
    }
    const { id } = request.params;

    // debugging
    log.debug(`handling delete conversation:`, id);

    const conversation = await AppDataSource.manager.delete(Conversation, {
      id,
    });
    event.sender.send(request.responseChannel, instanceToPlain(conversation));
  }
}
