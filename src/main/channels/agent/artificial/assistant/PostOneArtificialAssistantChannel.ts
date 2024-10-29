import { POST_ONE_ARTIFICIAL_ASSISTANT_CHANNEL } from '@shared/channels';
import { IpcRequest } from '@shared/interfaces/IpcRequest';
import { instanceToPlain } from 'class-transformer';
import { IpcMainEvent } from 'electron';
import log from 'electron-log/main';

import { AppDataSource } from '../../../../data-source';
import { ArtificialAssistant } from '../../../../entity/ArtificialAssistant';
import { PostOneChannel } from '../../../common/PostOneChannel';
import { SocialCue } from '../../../../entity/SocialCue';

export class PostOneArtificialAssistantChannel extends PostOneChannel {
  constructor() {
    super({
      name: POST_ONE_ARTIFICIAL_ASSISTANT_CHANNEL,
      entity: ArtificialAssistant,
    });
  }

  async handle(event: IpcMainEvent, request: IpcRequest): Promise<void> {
    if (!request.responseChannel) {
      request.responseChannel = `${this.getName()}:response`;
    }

    // todo: return error
    if (!request.params) {
      event.sender.send(request.responseChannel, {});
      return;
    }

    const { description, name, avatarUrl, socialCues } = request.params;

    log.debug(`linking socialCues: ${socialCues}`);


    const agent = new ArtificialAssistant();
    agent.name = name;
    agent.description = description;
    agent.avatarUrl = avatarUrl;

    // todo: handle no SocialCues
    if (socialCues) {
      const SocialCueRepository = AppDataSource.getRepository(SocialCue);
      const savedSocialCues: SocialCue[] = [];
      for (const socialCueId of socialCues) {
        const savedSocialCue = await SocialCueRepository.findOneBy({
          id: socialCueId,
        });
        if (savedSocialCue) {
          savedSocialCues.push(savedSocialCue);
        }
      }
      agent.socialCues = savedSocialCues;
    }

    await AppDataSource.manager.save(agent);
    event.sender.send(request.responseChannel, instanceToPlain(agent));
  }
}