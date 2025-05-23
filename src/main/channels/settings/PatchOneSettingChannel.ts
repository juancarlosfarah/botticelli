import { AppDataSource } from '@main/data-source';
import { Setting } from '@main/entity/Setting';
import { PATCH_ONE_SETTING_CHANNEL } from '@shared/channels';
import { IpcRequest } from '@shared/interfaces/IpcRequest';
import { PatchOneSettingParams } from '@shared/interfaces/Setting';
import { instanceToPlain } from 'class-transformer';
import { IpcMainEvent } from 'electron';

import { PatchOneChannel } from '../common/PatchOneChannel';

export class PatchOneSettingChannel extends PatchOneChannel {
  constructor() {
    super({
      name: PATCH_ONE_SETTING_CHANNEL,
      entity: Setting,
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

    const { modelProvider, model, apiKey, language, email } = request.params;

    // update the setting
    const repository = AppDataSource.getRepository(this.entity);
    await repository.upsert(
      {
        email,
        modelProvider,
        model,
        apiKey,
        language,
      },
      ['email'],
    );

    // get the updated setting

    const setting = await repository.findOneBy({ email });

    // return the updated setting to the frontend
    event.sender.send(request.responseChannel, instanceToPlain(setting));
  }
}
