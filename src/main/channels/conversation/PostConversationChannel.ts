import { instanceToPlain } from 'class-transformer';
import { IpcMainEvent } from 'electron';
import log from 'electron-log/main';

import { POST_CONVERSATION_CHANNEL } from '../../../shared/channels';
import { IpcRequest } from '../../../shared/interfaces/IpcRequest';
import { AppDataSource } from '../../data-source';
import { Conversation } from '../../entity/Conversation';
import { IpcChannel } from '../../interfaces/IpcChannel';

export class PostConversationChannel implements IpcChannel {
  getName(): string {
    return POST_CONVERSATION_CHANNEL;
  }

  async handle(event: IpcMainEvent, request: IpcRequest): Promise<void> {
    log.debug(`handling ${this.getName()}...`);

    if (!request.responseChannel) {
      request.responseChannel = `${this.getName()}:response`;
    }

    const { description, instructions, lead } = request.params;

    const conversation = new Conversation();
    conversation.description = description;
    conversation.instructions = instructions;
    conversation.lead = lead;

    await AppDataSource.manager.save(conversation);
    event.sender.send(request.responseChannel, instanceToPlain(conversation));
  }
}
