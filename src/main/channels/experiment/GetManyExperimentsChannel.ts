import { AppDataSource } from '@main/data-source';
import { GET_MANY_EXPERIMENTS_CHANNEL } from '@shared/channels';
import { IpcRequest } from '@shared/interfaces/IpcRequest';
import { instanceToPlain } from 'class-transformer';
import { IpcMainEvent } from 'electron';

import { Experiment } from '../../entity/Experiment';
import { GetManyChannel } from '../common/GetManyChannel';

export class GetManyExperimentsChannel extends GetManyChannel {
  constructor() {
    super({
      name: GET_MANY_EXPERIMENTS_CHANNEL,
      entity: Experiment,
    });
  }

  async handle(event: IpcMainEvent, request: IpcRequest): Promise<void> {
    if (!request.responseChannel) {
      request.responseChannel = `${this.getName()}:response`;
    }

    const { email } = request.params;

    if (!email) {
      event.sender.send(request.responseChannel, { agents: [] });
      return;
    }

    const experimentRepository = AppDataSource.getRepository(Experiment);

    const experiments = await experimentRepository.find({
      where: { email },
    });

    event.sender.send(request.responseChannel, {
      experiments: instanceToPlain(experiments),
    });
  }
}
