import { AppDataSource } from '@main/data-source';
import { Experiment } from '@main/entity/Experiment';
import { PATCH_ONE_EXPERIMENT_CHANNEL } from '@shared/channels';
import { IpcRequest } from '@shared/interfaces/IpcRequest';
import { instanceToPlain } from 'class-transformer';
import { IpcMainEvent } from 'electron';

import { PatchOneChannel } from '../common/PatchOneChannel';

export class PatchOneExperimentChannel extends PatchOneChannel {
  constructor() {
    super({
      name: PATCH_ONE_EXPERIMENT_CHANNEL,
      entity: Experiment,
    });
  }

  async handle(event: IpcMainEvent, request: IpcRequest): Promise<void> {
    if (!request.responseChannel) {
      request.responseChannel = `${this.getName()}:response`;
    }

    if (!request.params) {
      event.sender.send(request.responseChannel, {});
      return;
    }

    const { id, name, description } = request.params;

    await AppDataSource.manager.update(Experiment, id, {
      name,
      description,
    });

    const repository = AppDataSource.getRepository(this.entity);
    const experiment = await repository.findOneBy({ id });

    event.sender.send(request.responseChannel, instanceToPlain(experiment));
  }
}
