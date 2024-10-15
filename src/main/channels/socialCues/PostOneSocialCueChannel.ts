import { POST_ONE_SOCIALCUE_CHANNEL } from '@shared/channels';
import { IpcRequest } from '@shared/interfaces/IpcRequest';
import { PostOneSocialCueParams } from '@shared/interfaces/SocialCue';
import { instanceToPlain } from 'class-transformer';
import { IpcMainEvent } from 'electron';
import log from 'electron-log/main';
import _ from 'lodash';

import { AppDataSource } from '../../data-source';
import { SocialCue } from '../../entity/SocialCue';
import { PostOneChannel } from '../common/PostOneChannel';

export class PostOneSocialCueChannel extends PostOneChannel {
  constructor() {
    super({
      name: POST_ONE_SOCIALCUE_CHANNEL,
      entity: SocialCue,
    });
  }

  async handle(
    event: IpcMainEvent,
    request: IpcRequest<PostOneSocialCueParams>,
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
    const socialCueRepository = AppDataSource.getRepository(SocialCue);

    const { description, name, group, formulation } =
      request.params;

    const socialCue = new SocialCue();
    socialCue.name = name;
    socialCue.group = group;
    socialCue.formulation = formulation;
    socialCue.description = description;

    const savedSocialCue = await socialCueRepository.save(socialCue);
    log.debug(`saved socialCue ${savedSocialCue.id}`);

    event.sender.send(
      request.responseChannel,
      instanceToPlain(savedSocialCue),
    );
  }
}
