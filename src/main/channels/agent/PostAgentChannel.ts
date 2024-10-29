import { instanceToPlain } from 'class-transformer';
import { IpcMainEvent } from 'electron';
import log from 'electron-log/main';


import { POST_AGENT_CHANNEL } from '../../../shared/channels';
import { IpcRequest } from '../../../shared/interfaces/IpcRequest';
import { AppDataSource } from '../../data-source';
import { Agent } from '../../entity/Agent';
import { IpcChannel } from '../../interfaces/IpcChannel'
import { SocialCue } from '../../entity/SocialCue';

export class PostAgentChannel implements IpcChannel {
  getName(): string {
    return POST_AGENT_CHANNEL;
  }

  async handle(event: IpcMainEvent, request: IpcRequest): Promise<void> {
    if (!request.responseChannel) {
      request.responseChannel = `${this.getName()}:response`;
    }

    const { description, name, type, socialCues } = request.params;

    const agent = new Agent();
    agent.name = name;
    agent.description = description;
    agent.type = type;
    
    // todo: array should come from the front end
    const socialCueRepository = AppDataSource.getRepository(SocialCue);
    const savedSocialCue = await socialCueRepository.findOneBy({ id: socialCues });
    if (savedSocialCue) {
      agent.socialCues = [savedSocialCue];
    }

    log.debug(`got socialCues:`, socialCues);

    await AppDataSource.manager.save(agent);
    event.sender.send(request.responseChannel, instanceToPlain(agent));
  }
}