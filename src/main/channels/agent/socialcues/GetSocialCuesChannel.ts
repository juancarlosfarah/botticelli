import { instanceToPlain } from 'class-transformer';
import { IpcMainEvent } from 'electron';
import log from 'electron-log/main';

import { GET_SOCIALCUE_CHANNEL } from '../../../shared/channels';
import { IpcRequest } from '../../../shared/interfaces/IpcRequest';
import { AppDataSource } from '../../data-source';
import { SocialCue } from '../../entity/SocialCue';
import { IpcChannel } from '../../interfaces/IpcChannel';

export class GetSocialCuesChannel implements IpcChannel {
  getName(): string {
    return GET_SOCIALCUE_CHANNEL;
  }

  async handle(event: IpcMainEvent, request: IpcRequest): Promise<void> {
    log.debug(`handling ${this.getName()}...`);

    if (!request.responseChannel) {
      request.responseChannel = `${this.getName()}:response`;
    }
    const socialcues = await AppDataSource.manager.find(SocialCue);
    event.sender.send(request.responseChannel, instanceToPlain(socialcues));
  }
}
