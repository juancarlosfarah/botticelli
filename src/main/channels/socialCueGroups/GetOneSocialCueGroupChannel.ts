import { GET_ONE_SOCIALCUEGROUP_CHANNEL } from '@shared/channels';
import { IpcRequest } from '@shared/interfaces/IpcRequest';
import { GetOneSocialCueGroupParams } from '@shared/interfaces/SocialCueGroup';
import { instanceToPlain } from 'class-transformer';
import { IpcMainEvent } from 'electron';
import log from 'electron-log/main';

import { AppDataSource } from '../../data-source';
import { SocialCueGroup } from '../../entity/SocialCueGroup';
import { GetOneChannel } from '../common/GetOneChannel';

export class GetOneSocialCueGroupChannel extends GetOneChannel {
  constructor() {
    super({
      name: GET_ONE_SOCIALCUEGROUP_CHANNEL,
      entity: SocialCueGroup,
    });
  }

  async handle(
    event: IpcMainEvent,
    request: IpcRequest<GetOneSocialCueGroupParams>,
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
      },
      take: 1,
    });

    const instance = instances?.length ? instances[0] : null;

    // debugging
    if (instance) {
      log.debug(`got socialCue ${instance.id}`);
    }

    // todo: handle 404

    event.sender.send(request.responseChannel, instanceToPlain(instance));
  }
}
