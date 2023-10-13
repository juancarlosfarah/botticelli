import { IpcMainEvent } from 'electron';
import { IpcChannel } from '../interfaces/IpcChannel';
import { POST_CONVERSATION_CHANNEL } from '../../shared/channels';
import { IpcRequest } from '../../shared/interfaces/IpcRequest';

export class PostConversationChannel implements IpcChannel {
  getName(): string {
    return POST_CONVERSATION_CHANNEL;
  }

  handle(event: IpcMainEvent, request: IpcRequest): void {
    if (!request.responseChannel) {
      request.responseChannel = `${this.getName()}:response`;
    }
    console.log('called!', request);
    event.sender.send(request.responseChannel, { hello: 'world' });
  }
}
