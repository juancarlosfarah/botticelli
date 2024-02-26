import { POST_ONE_KEY_PRESS_EVENT_CHANNEL } from '@shared/channels';
import { IpcRequest } from '@shared/interfaces/IpcRequest';
import { instanceToPlain } from 'class-transformer';
import { IpcMainEvent } from 'electron';
import log from 'electron-log/main';

import { AppDataSource } from '../../data-source';
import { KeyPressEvent } from '../../entity/KeyPressEvent';
import { Message } from '../../entity/Message';
import { PostOneChannel } from '../common/PostOneChannel';

export class PostOneKeyPressEventChannel extends PostOneChannel {
  constructor() {
    super({
      name: POST_ONE_KEY_PRESS_EVENT_CHANNEL,
      entity: KeyPressEvent,
    });
  }

  async handle(event: IpcMainEvent, request: IpcRequest): Promise<void> {
    log.debug(`handling ${this.getName()}...`);

    if (!request.responseChannel) {
      request.responseChannel = `${this.getName()}:response`;
    }

    const { messageId, keyPressEvent } = request.params;

    const messageRepository = AppDataSource.getRepository(Message);

    const savedMessage = await messageRepository.findOneBy({ id: messageId });

    if (savedMessage) {
      const newKeyPressEvent = new KeyPressEvent();
      newKeyPressEvent.key = keyPressEvent.key;
      newKeyPressEvent.timestamp = keyPressEvent.timestamp;
      newKeyPressEvent.message = savedMessage;

      await AppDataSource.manager.save(newKeyPressEvent);
      event.sender.send(
        request.responseChannel,
        instanceToPlain(newKeyPressEvent),
      );
    } else {
      // todo: handle error
      event.sender.send(request.responseChannel);
    }
  }
}
