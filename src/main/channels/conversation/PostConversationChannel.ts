import { IpcMainEvent } from 'electron';
import { IpcChannel } from '../../interfaces/IpcChannel';
import { POST_CONVERSATION_CHANNEL } from '../../../shared/channels';
import { IpcRequest } from '../../../shared/interfaces/IpcRequest';
import { Conversation } from '../../entity/Conversation';
import { instanceToPlain } from 'class-transformer';
import { AppDataSource } from '../../data-source';

export class PostConversationChannel implements IpcChannel {
  getName(): string {
    return POST_CONVERSATION_CHANNEL;
  }

  async handle(event: IpcMainEvent, request: IpcRequest): Promise<void> {
    if (!request.responseChannel) {
      request.responseChannel = `${this.getName()}:response`;
    }
    const conversation = new Conversation();

    await AppDataSource.manager.save(conversation);
    event.sender.send(request.responseChannel, instanceToPlain(conversation));
  }
}
