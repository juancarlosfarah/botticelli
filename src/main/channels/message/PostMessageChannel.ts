import { POST_MESSAGE_CHANNEL } from '@shared/channels';
import { IpcRequest } from '@shared/interfaces/IpcRequest';
import { PostOneMessageHandlerParams } from '@shared/interfaces/Message';
import { instanceToPlain } from 'class-transformer';
import { IpcMainEvent } from 'electron';
import log from 'electron-log/main';

import { AppDataSource } from '../../data-source';
import { Message } from '../../entity/Message';
import { IpcChannel } from '../../interfaces/IpcChannel';

export class PostMessageChannel implements IpcChannel {
  getName(): string {
    return POST_MESSAGE_CHANNEL;
  }

  async handle(
    event: IpcMainEvent,
    request: IpcRequest<PostOneMessageHandlerParams>,
  ): Promise<void> {
    // debug
    log.debug(`handling ${this.getName()}...`);

    if (!request.responseChannel) {
      request.responseChannel = `${this.getName()}:response`;
    }

    // todo: error handling
    if (!request.params) {
      event.sender.send(request.responseChannel, {});
      return;
    }

    const { exchangeId, content, sender, inputType } = request.params;

    // debug
    log.debug(`posting message:`, content, `for exchange`, exchangeId);

    const messageRepository = AppDataSource.getRepository(Message);
    const message = new Message();
    message.content = content;
    message.exchange = exchangeId;
    message.sender = sender;
    message.inputType = inputType;

    const { id } = await messageRepository.save(message);

    const savedResponse = await messageRepository.findOneBy({ id });

    // debug
    log.debug(`posted message ${savedResponse?.id}`);

    event.sender.send(request.responseChannel, instanceToPlain(savedResponse));
  }
}
