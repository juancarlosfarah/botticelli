import { Trigger } from '@main/entity/Trigger';
import { GET_MANY_TRIGGERS_CHANNEL } from '@shared/channels';
import { IpcRequest } from '@shared/interfaces/IpcRequest';
import { instanceToPlain } from 'class-transformer';
import { IpcMainEvent } from 'electron';
import log from 'electron-log/main';

import { AppDataSource } from '../../data-source';
import { GetManyChannel } from '../common/GetManyChannel';

export class GetManyTriggersChannel extends GetManyChannel {
  constructor() {
    super({
      name: GET_MANY_TRIGGERS_CHANNEL,
      entity: Trigger,
    });
  }

  // filter the triggers with respect to the user
  async handle(event: IpcMainEvent, request: IpcRequest): Promise<void> {
    log.debug(`handling ${this.getName()} with params:`, request.params);

    if (!request.responseChannel) {
      request.responseChannel = `${this.getName()}:response`;
    }

    const { email } = request.params;

    if (!email) {
      log.error('Email is missing in GetManyTriggersChannel request');
      event.sender.send(request.responseChannel, { triggers: [] });
      return;
    }

    const triggerRepository = AppDataSource.getRepository(Trigger);

    const triggers = await triggerRepository.find({
      where: { email },
    });

    event.sender.send(request.responseChannel, {
      triggers: instanceToPlain(triggers),
    });
  }
}
