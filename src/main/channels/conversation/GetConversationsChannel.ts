import { IpcMainEvent } from 'electron';
import { IpcChannel } from '../../interfaces/IpcChannel';
import { GET_CONVERSATIONS_CHANNEL } from '../../../shared/channels';
import { IpcRequest } from '../../../shared/interfaces/IpcRequest';
import { Conversation } from '../../entity/Conversation';
import { instanceToPlain } from 'class-transformer';
import { AppDataSource } from '../../data-source';

export class GetConversationsChannel implements IpcChannel {
  getName(): string {
    return GET_CONVERSATIONS_CHANNEL;
  }

  async handle(event: IpcMainEvent, request: IpcRequest): Promise<void> {
    // todo: debug
    console.log(`handling ${this.getName()}...`);

    if (!request.responseChannel) {
      request.responseChannel = `${this.getName()}:response`;
    }
    const conversations = await AppDataSource.manager.find(Conversation);
    event.sender.send(request.responseChannel, instanceToPlain(conversations));
  }
}
