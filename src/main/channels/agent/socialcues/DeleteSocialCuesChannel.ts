import { instanceToPlain } from 'class-transformer';
import { IpcMainEvent } from 'electron';
import log from 'electron-log/main';

import { DELETE_AGENT_CHANNEL } from '../../../shared/channels';
import { IpcRequest } from '../../../shared/interfaces/IpcRequest';
import { AppDataSource } from '../../data-source';
import { SocialCue } from '../../entity/SocialCue';
import { IpcChannel } from '../../interfaces/IpcChannel';

export class DeleteSocialCueChannel implements IpcChannel {
  getName(): string {
    return DELETE_SOCIALCUE_CHANNEL;
  }

  async handle(event: IpcMainEvent, request: IpcRequest): Promise<void> {
    if (!request.responseChannel) {
      request.responseChannel = `${this.getName()}:response`;
    }
    const { id } = request.params;

    // debugging
    log.debug(`handling delete agent:`, id);

    const socialcue = await AppDataSource.manager.delete(SocialCue, { id });
    event.sender.send(request.responseChannel, instanceToPlain(socialcue));
  }
}
