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

    await messageRepository.save(message);
    event.sender.send(request.responseChannel, instanceToPlain(message));

    // if requires response post to bot api
    if (true) {
      const messages = await messageRepository.findBy({ conversation: { id: conversationId } });
      console.log(messages);

      // transform messages to prompt format
      const prompt = 'Give me a random name for a baby boy.';
    }
  }
}
