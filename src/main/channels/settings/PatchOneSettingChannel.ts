import { AppDataSource } from '@main/data-source';
import { Settings } from '@main/entity/Settings';
import { PATCH_ONE_SETTING_CHANNEL } from '@shared/channels';
import { IpcRequest } from '@shared/interfaces/IpcRequest';
import { PatchOneSettingParams } from '@shared/interfaces/Settings';
import { instanceToPlain } from 'class-transformer';
import { IpcMainEvent } from 'electron';

import { PatchOneChannel } from '../common/PatchOneChannel';

export class PatchOneSettingChannel extends PatchOneChannel {
  constructor() {
    super({
      name: PATCH_ONE_SETTING_CHANNEL,
      entity: Settings,
    });
  }

  async handle(
    event: IpcMainEvent,
    request: IpcRequest<PatchOneSettingParams>,
  ): Promise<void> {
    if (!request.responseChannel) {
      request.responseChannel = `${this.getName()}:response`;
    }

    // todo: error handling
    if (!request.params) {
      event.sender.send(request.responseChannel, {});
      return;
    }

    const { name } = request.params;

    // update the setting
    await AppDataSource.manager.update(Settings, name, {
      name,
    });

    // get the updated agent
    const repository = AppDataSource.getRepository(this.entity);
    const setting = await repository.findOneBy({ name });

    // return the updated agent to the frontend
    event.sender.send(request.responseChannel, instanceToPlain(setting));
  }
}
