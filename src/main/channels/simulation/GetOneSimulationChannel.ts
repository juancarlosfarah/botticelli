import { GET_ONE_SIMULATION_CHANNEL } from '@shared/channels';
import { IpcRequest } from '@shared/interfaces/IpcRequest';
import { GetOneSimulationParams } from '@shared/interfaces/Simulation';
import { instanceToPlain } from 'class-transformer';
import { IpcMainEvent } from 'electron';
import log from 'electron-log/main';

import { AppDataSource } from '../../data-source';
import { Simulation } from '../../entity/Simulation';
import { GetOneChannel } from '../common/GetOneChannel';

export class GetOneSimulationChannel extends GetOneChannel {
  constructor() {
    super({
      name: GET_ONE_SIMULATION_CHANNEL,
      entity: Simulation,
    });
  }

  async handle(
    event: IpcMainEvent,
    request: IpcRequest<GetOneSimulationParams>,
  ): Promise<void> {
    log.debug(`handling ${this.name}...`);

    if (!request.responseChannel) {
      request.responseChannel = `${this.name}:response`;
    }

    // todo: error handling
    if (!request.params) {
      event.sender.send(request.responseChannel, {});
      return;
    }

    const params = request?.params;

    // debugging
    log.debug(`using params:`, params);

    const repository = AppDataSource.getRepository(this.entity);
    const instances = await repository.find({
      where: {
        ...params,
      },
      relations: {
        participants: true,
        interactionTemplates: {
          interactionTemplate: true,
        },
        interactions: true,
      },
      take: 1,
    });

    const instance = instances?.length ? instances[0] : null;

    // debugging
    if (instance) {
      log.debug(`got simulation ${instance.id}`);
    }

    // todo: handle 404

    event.sender.send(request.responseChannel, instanceToPlain(instance));
  }
}
