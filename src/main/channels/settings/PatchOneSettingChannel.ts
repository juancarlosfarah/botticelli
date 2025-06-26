import { AppDataSource } from '@main/data-source';
import { Setting } from '@main/entity/Setting';
import { PATCH_ONE_SETTING_CHANNEL } from '@shared/channels';
import { IpcRequest } from '@shared/interfaces/IpcRequest';
import { PatchOneSettingParams } from '@shared/interfaces/Setting';
import { instanceToPlain } from 'class-transformer';
import { IpcMainEvent } from 'electron';
import log from 'electron-log/main';

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
    const responseChannel =
      request.responseChannel || `${this.getName()}:response`;
    log.debug('PATCH_ONE_SETTING_CHANNEL received:', request);

    if (!request.params) {
      event.sender.send(responseChannel, {});
      return;
    }

    const { modelProvider, model, apiKey, language, email } = request.params;

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
    log.debug('Sending response on channel:', responseChannel);
    event.sender.send(responseChannel, instanceToPlain(setting));
  }
}
