import { instanceToPlain } from 'class-transformer';
import { IpcMainEvent } from 'electron';
import log from 'electron-log/main';

import { POST_MESSAGE_CHANNEL } from '../../../shared/channels';
import { IpcRequest } from '../../../shared/interfaces/IpcRequest';
import { AppDataSource } from '../../data-source';
import { Message } from '../../entity/Message';
import { IpcChannel } from '../../interfaces/IpcChannel';

export class PostMessageChannel implements IpcChannel {
  getName(): string {
    return POST_MESSAGE_CHANNEL;
  }

  async handle(event: IpcMainEvent, request: IpcRequest): Promise<void> {
    // debug
    log.debug(`handling ${this.getName()}...`);

    if (!request.responseChannel) {
      request.responseChannel = `${this.getName()}:response`;
    }

    const { exchangeId, content, sender } = request.params;

    // debug
    log.debug(`posting message:`, content, `for exchange`, exchangeId);

    const messageRepository = AppDataSource.getRepository(Message);
    const message = new Message();
    message.content = content;
    message.exchange = exchangeId;
    message.sender = sender;

    const { id } = await messageRepository.save(message);

    const savedResponse = await messageRepository.findOneBy({ id });

    // debug
    log.debug(`posted message:`, savedResponse);

    event.sender.send(request.responseChannel, instanceToPlain(savedResponse));
  }
}
