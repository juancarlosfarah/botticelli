import { AppDataSource } from '@main/data-source';
import { Simulation } from '@main/entity/Simulation';
import { PATCH_ONE_SIMULATION_CHANNEL } from '@shared/channels';
import { IpcRequest } from '@shared/interfaces/IpcRequest';
import { instanceToPlain } from 'class-transformer';
import { IpcMainEvent } from 'electron';

import { PatchOneChannel } from '../common/PatchOneChannel';

export class PatchOneSimulationChannel extends PatchOneChannel {
  constructor() {
    super({
      name: PATCH_ONE_SIMULATION_CHANNEL,
      entity: Simulation,
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

    await AppDataSource.manager.update(Simulation, id, {
      name,
      description,
    });

    const repository = AppDataSource.getRepository(this.entity);
    const simulation = await repository.findOneBy({ id });

    event.sender.send(request.responseChannel, instanceToPlain(simulation));
  }
}
