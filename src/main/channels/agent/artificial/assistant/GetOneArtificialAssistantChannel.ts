import { GET_ONE_ARTIFICIAL_ASSISTANT_CHANNEL } from '@shared/channels';

import { ArtificialAssistant } from '../../../../entity/ArtificialAssistant';
import { GetOneChannel } from '../../../common/GetOneChannel';
import { GetOneAgentParams } from '@shared/interfaces/Agent';

import { IpcRequest } from '@shared/interfaces/IpcRequest';
import { instanceToPlain } from 'class-transformer';
import { IpcMainEvent } from 'electron';
import log from 'electron-log/main';

import { AppDataSource } from '../../../../data-source';


export class GetOneArtificialAssistantChannel extends GetOneChannel {
  constructor() {
    super({
      name: GET_ONE_ARTIFICIAL_ASSISTANT_CHANNEL,
      entity: ArtificialAssistant,
    }); 
  }

  async handle(
    event: IpcMainEvent,
    request: IpcRequest<GetOneAgentParams>,
  ): Promise<void> {
    log.debug(`handling ${this.name}...`);

    if (!request.responseChannel) {
      request.responseChannel = `${this.name}:response`;
    }

    // todo: error handling
    const { params } = request;

    // debugging
    log.debug(`using query: ${params}`);

    const repository = AppDataSource.getRepository(this.entity);
    const instances = await repository.find({
      where: {
        ...params,
      },
      relations: { socialCues: true },
      take: 1,
    });

    const instance = instances?.length ? instances[0] : null;

    // debugging
    if (instance) {
      log.debug(`got agent ${instance.id}`);
    }

    event.sender.send(request.responseChannel, instanceToPlain(instance));
  }
}


