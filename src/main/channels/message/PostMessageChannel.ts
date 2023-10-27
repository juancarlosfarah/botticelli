import { IpcMainEvent } from 'electron';
import { IpcChannel } from '../../interfaces/IpcChannel';
import { POST_MESSAGE_CHANNEL } from '../../../shared/channels';
import { IpcRequest } from '../../../shared/interfaces/IpcRequest';
import { Message } from '../../entity/Message';
import { instanceToPlain } from 'class-transformer';
import { AppDataSource } from '../../data-source';

export class PostMessageChannel implements IpcChannel {
  getName(): string {
    return POST_MESSAGE_CHANNEL;
  }

  async handle(event: IpcMainEvent, request: IpcRequest): Promise<void> {
    // debug
    console.log(`handling ${this.getName()}...`);

    if (!request.responseChannel) {
      request.responseChannel = `${this.getName()}:response`;
    }

    const { conversationId, content } = request.params;

    // debugging
    console.log(conversationId, content);

    const messageRepository = AppDataSource.getRepository(Message);
    const message = new Message();
    message.content = content;
    message.conversation = conversationId;

    // todo: make dynamic
    message.sender = 2;

    const { id } = await messageRepository.save(message);

    const savedResponse = await messageRepository.findOneBy({ id });

    // debug
    console.log(savedResponse);

    event.sender.send(request.responseChannel, instanceToPlain(savedResponse));
  }
}
