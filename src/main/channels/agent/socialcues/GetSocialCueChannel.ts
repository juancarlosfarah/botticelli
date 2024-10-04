import { instanceToPlain } from 'class-transformer';
import { IpcMainEvent } from 'electron';
import log from 'electron-log/main';

import { GET_AGENT_CHANNEL } from '../../../shared/channels';
import { IpcRequest } from '../../../shared/interfaces/IpcRequest';
import { AppDataSource } from '../../data-source';
import { SocialCue } from '../../entity/SocialCue';
import { IpcChannel } from '../../interfaces/IpcChannel';

export class GetSocialCueChannel implements IpcChannel {
  getName(): string {
    return GET_SOCIALCUE_CHANNEL;
  }

  async handle(event: IpcMainEvent, request: IpcRequest): Promise<void> {
    if (!request.responseChannel) {
      request.responseChannel = `${this.getName()}:response`;
    }

    const { query } = request.params;

    // // debugging
    // log.debug(`handling get agent with query:`, query);

    const socialCueRepository = AppDataSource.getRepository(SocialCue);
    const socialCue = await socialCueRepository.findOneBy(query);

    // // debugging
    // log.debug(`got agent:`, agent);

    event.sender.send(request.responseChannel, instanceToPlain(socialCue));
  }
}
