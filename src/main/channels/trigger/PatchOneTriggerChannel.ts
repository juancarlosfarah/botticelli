import { AppDataSource } from '@main/data-source';
import { Trigger } from '@main/entity/Trigger';
import { PATCH_ONE_TRIGGER_CHANNEL } from '@shared/channels';
import { IpcRequest } from '@shared/interfaces/IpcRequest';
import { PatchOneTriggerParams } from '@shared/interfaces/Trigger';
import { instanceToPlain } from 'class-transformer';
import { IpcMainEvent } from 'electron';

import { PatchOneChannel } from '../common/PatchOneChannel';

export class PatchOneTriggerChannel extends PatchOneChannel {
  constructor() {
    super({
      name: PATCH_ONE_TRIGGER_CHANNEL,
      entity: Trigger,
    });
  }

  async handle(
    event: IpcMainEvent,
    request: IpcRequest<PatchOneTriggerParams>,
  ): Promise<void> {
    if (!request.responseChannel) {
      request.responseChannel = `${this.getName()}:response`;
    }

    if (!request.params) {
      event.sender.send(request.responseChannel, {});
      return;
    }

    const { id, description, name } = request.params;

    await AppDataSource.manager.update(Trigger, id, {
      description,
      name,
    });

    const repository = AppDataSource.getRepository(this.entity);
    const trigger = await repository.findOneBy({ id });

    event.sender.send(request.responseChannel, instanceToPlain(trigger));
  }
}
