import { Agent } from '@main/entity/Agent';
import { POST_MESSAGE_CHANNEL } from '@shared/channels';
import { IpcRequest } from '@shared/interfaces/IpcRequest';
import { PostOneMessageHandlerParams } from '@shared/interfaces/Message';
import { instanceToPlain } from 'class-transformer';
import { IpcMainEvent } from 'electron';
import log from 'electron-log/main';

import { AppDataSource } from '../../data-source';
import { Exchange } from '../../entity/Exchange';
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
    log.debug(`handling ${this.getName()}...`);

    if (!request.responseChannel) {
      request.responseChannel = `${this.getName()}:response`;
    }

    if (!request.params) {
      event.sender.send(request.responseChannel, {});
      return;
    }

    const { exchangeId, content, sender, inputType } = request.params;

    log.debug(`posting message:`, content, `for exchange`, exchangeId);

    try {
      const messageRepository = AppDataSource.getRepository(Message);
      const exchangeRepository = AppDataSource.getRepository(Exchange);
      const agentRepository = AppDataSource.getRepository(Agent);

      const senderAgent = sender?.id
        ? await agentRepository.findOneBy({ id: sender.id })
        : null;

      if (!senderAgent) {
        log.error(`Invalid sender provided:`, sender);
        event.sender.send(request.responseChannel, {
          error: `Invalid sender`,
        });
        return;
      }

      const exchange = await exchangeRepository.findOneBy({ id: exchangeId });

      if (!exchange) {
        log.error(`Exchange not found with id: ${exchangeId}`);
        event.sender.send(request.responseChannel, {
          error: `Exchange not found with id ${exchangeId}`,
        });
        return;
      }

      const message = new Message();
      message.content = content;
      message.exchange = exchange;
      message.sender = senderAgent;
      message.inputType = inputType;

      const saved = await messageRepository.save(message);

      log.debug(`posted message ${saved?.id}`);
      event.sender.send(request.responseChannel, instanceToPlain(saved));
    } catch (error) {
      log.error(`Error posting message:`, error);
      event.sender.send(request.responseChannel, {
        error: 'Failed to save message',
        detail: error.message,
      });
    }
  }
}
