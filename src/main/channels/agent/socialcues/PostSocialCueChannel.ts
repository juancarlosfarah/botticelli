import { instanceToPlain } from 'class-transformer';
import { IpcMainEvent } from 'electron';

import { POST_AGENT_CHANNEL } from '../../../shared/channels';
import { IpcRequest } from '../../../shared/interfaces/IpcRequest';
import { AppDataSource } from '../../data-source';
import { SocialCue } from '../../entity/SocialCue';
import { IpcChannel } from '../../interfaces/IpcChannel';
import { log } from 'console';

export class PostSocialCueChannel implements IpcChannel {
  getName(): string {
    return POST_SOCIALCUE_CHANNEL;
  }

  async handle(event: IpcMainEvent, request: IpcRequest): Promise<void> {
    if (!request.responseChannel) {
      request.responseChannel = `${this.getName()}:response`;
    }

    const { description, name, type } = request.params;

    const socialCue = new socialCue();
    socialCue.name = name;
    socialCue.description = description;
    socialCue.type = type;

    await AppDataSource.manager.save(socialCue);
    event.sender.send(request.responseChannel, instanceToPlain(socialCue));
  }
}
