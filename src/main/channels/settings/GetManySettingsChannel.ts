import { AppDataSource } from '@main/data-source';
import { Setting } from '@main/entity/Setting';
import { GET_MANY_SETTINGS_CHANNEL } from '@shared/channels';
import { IpcRequest } from '@shared/interfaces/IpcRequest';
import { instanceToPlain } from 'class-transformer';
import { IpcMainEvent } from 'electron';

import { GetManyChannel } from '../common/GetManyChannel';

export class GetManySettingsChannel extends GetManyChannel {
  constructor() {
    super({
      name: GET_MANY_SETTINGS_CHANNEL,
      entity: Setting,
    });
  }

  async handle(event: IpcMainEvent, request: IpcRequest): Promise<void> {
    if (!request.responseChannel) {
      request.responseChannel = `${this.getName()}:response`;
    }

    const { email } = request.params;

    if (!email) {
      event.sender.send(request.responseChannel, { settings: [] });
      return;
    }

    const repository = AppDataSource.getRepository(Setting);

    const settings = await repository.find({
      where: { email },
    });

    event.sender.send(request.responseChannel, {
      settings: instanceToPlain(settings),
    });
  }
}
