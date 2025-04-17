import { AppDataSource } from '@main/data-source';
import { GET_MANY_SIMULATIONS_CHANNEL } from '@shared/channels';
import { IpcRequest } from '@shared/interfaces/IpcRequest';
import { instanceToPlain } from 'class-transformer';
import { IpcMainEvent } from 'electron';

import { Simulation } from '../../entity/Simulation';
import { GetManyChannel } from '../common/GetManyChannel';

export class GetManySimulationsChannel extends GetManyChannel {
  constructor() {
    super({
      name: GET_MANY_SIMULATIONS_CHANNEL,
      entity: Simulation,
    });
  }

  async handle(event: IpcMainEvent, request: IpcRequest): Promise<void> {
    if (!request.responseChannel) {
      request.responseChannel = `${this.getName()}:response`;
    }

    const { email } = request.params;

    if (!email) {
      event.sender.send(request.responseChannel, { simulations: [] });
      return;
    }

    try {
      const simulationRepository = AppDataSource.getRepository(Simulation);

      const simulations = await simulationRepository.find({
        where: { email },
      });

      event.sender.send(request.responseChannel, {
        simulations: instanceToPlain(simulations),
      });
    } catch (error) {
      event.sender.send(request.responseChannel, {
        simulations: [],
        error: 'Failed to fetch simulations',
      });
    }
  }
}
