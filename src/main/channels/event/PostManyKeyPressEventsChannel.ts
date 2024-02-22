import { POST_MANY_KEY_PRESS_EVENTS_CHANNEL } from '@shared/channels';
import { IpcRequest } from '@shared/interfaces/IpcRequest';
import { instanceToPlain } from 'class-transformer';
import { IpcMainEvent } from 'electron';
import log from 'electron-log/main';

import { AppDataSource } from '../../data-source';
import { KeyPressEvent } from '../../entity/KeyPressEvent';
import { Message } from '../../entity/Message';
import { PostManyChannel } from '../common/PostManyChannel';

export class PostManyKeyPressEventsChannel extends PostManyChannel {
  constructor() {
    super({
      name: POST_MANY_KEY_PRESS_EVENTS_CHANNEL,
      entity: KeyPressEvent,
    });
  }

  async handle(event: IpcMainEvent, request: IpcRequest): Promise<void> {
    log.debug(`handling ${this.getName()}...`);

    if (!request.responseChannel) {
      request.responseChannel = `${this.getName()}:response`;
    }

    const { messageId, keyPressEvents } = request.params;

    const messageRepository = AppDataSource.getRepository(Message);

    const savedMessage = await messageRepository.findOneBy({ id: messageId });

    if (savedMessage) {
      const newKeyPressEvents = keyPressEvents.map((keyPressEvent) => {
        const newKeyPressEvent = new KeyPressEvent();
        newKeyPressEvent.key = keyPressEvent.key;
        newKeyPressEvent.timestamp = keyPressEvent.timestamp;
        newKeyPressEvent.message = savedMessage;
        return newKeyPressEvent;
      });

      await AppDataSource.manager.save(newKeyPressEvents);
      event.sender.send(
        request.responseChannel,
        instanceToPlain(newKeyPressEvents),
      );
    } else {
      // todo: handle error
      event.sender.send(request.responseChannel);
    }
  }
}
