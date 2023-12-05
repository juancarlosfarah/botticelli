import { GET_ONE_INTERACTION_TEMPLATE_CHANNEL } from '@shared/channels';
import { IpcRequest } from '@shared/interfaces/IpcRequest';
import { instanceToPlain } from 'class-transformer';
import { IpcMainEvent } from 'electron';
import log from 'electron-log/main';

import { AppDataSource } from '../../data-source';
import { InteractionTemplate } from '../../entity/InteractionTemplate';
import { GetOneChannel } from '../common/GetOneChannel';

export class GetOneInteractionTemplateChannel extends GetOneChannel {
  constructor() {
    super({
      name: GET_ONE_INTERACTION_TEMPLATE_CHANNEL,
      entity: InteractionTemplate,
    });
  }

  async handle(event: IpcMainEvent, request: IpcRequest): Promise<void> {
    log.debug(`handling ${this.name}...`);

    if (!request.responseChannel) {
      request.responseChannel = `${this.name}:response`;
    }

    // todo: error handling
    const query = request?.params?.query;

    // debugging
    log.debug(`using query:`, query);

    const repository = AppDataSource.getRepository(this.entity);
    const instances = await repository.find({
      where: {
        ...query,
      },
      relations: { exchangeTemplates: true },
      take: 1,
    });

    const instance = instances?.length ? instances[0] : null;
    // debugging
    log.debug(`got ${this.entity}:`, instance);

    event.sender.send(request.responseChannel, instanceToPlain(instance));
  }
}
