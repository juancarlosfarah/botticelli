import { POST_ONE_SOCIAL_CUE_GROUP_CHANNEL } from '@shared/channels';
import { IpcRequest } from '@shared/interfaces/IpcRequest';
import { PostOneSocialCueGroupParams } from '@shared/interfaces/SocialCueGroup';
import { instanceToPlain } from 'class-transformer';
import { IpcMainEvent } from 'electron';
import log from 'electron-log/main';
import _ from 'lodash';

import { AppDataSource } from '../../data-source';
import { SocialCueGroup } from '../../entity/SocialCueGroup';
import { PostOneChannel } from '../common/PostOneChannel';

export class PostOneSocialCueGroupChannel extends PostOneChannel {
  constructor() {
    super({
      name: POST_ONE_SOCIAL_CUE_GROUP_CHANNEL,
      entity: SocialCueGroup,
    });
  }

  async handle(
    event: IpcMainEvent,
    request: IpcRequest<PostOneSocialCueGroupParams>,
  ): Promise<void> {
    log.debug(`handling ${this.getName()}...`);

    if (!request.responseChannel) {
      request.responseChannel = `${this.getName()}:response`;
    }

    // todo: error handling
    if (!request.params) {
      event.sender.send(request.responseChannel, {});
      return;
    }

    // // repositories
    const socialCueGroupRepository = AppDataSource.getRepository(SocialCueGroup);

    const { description, name } =
      request.params;

    const socialCueGroup = new SocialCueGroup();
    socialCueGroup.name = name;
    socialCueGroup.description = description;

    const savedSocialCueGroup = await socialCueGroupRepository.save(socialCueGroup);
    log.debug(`saved socialCueGroup ${savedSocialCueGroup.id}`);

    event.sender.send(
      request.responseChannel,
      instanceToPlain(savedSocialCueGroup),
    );
  }
}
