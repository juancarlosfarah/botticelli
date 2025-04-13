import { instanceToPlain } from 'class-transformer';
import { IpcMainEvent } from 'electron';
import log from 'electron-log/main';

import { POST_ONE_EXCHANGE_CHANNEL } from '../../../shared/channels';
import { IpcRequest } from '../../../shared/interfaces/IpcRequest';
import { AppDataSource } from '../../data-source';
import { Agent } from '../../entity/Agent';
import { Exchange } from '../../entity/Exchange';
import { Trigger } from '../../entity/Trigger';
import { PostOneChannel } from '../common/PostOneChannel';

export class PostOneExchangeChannel extends PostOneChannel {
  constructor() {
    super({ name: POST_ONE_EXCHANGE_CHANNEL, entity: Exchange });
  }

  async handle(event: IpcMainEvent, request: IpcRequest): Promise<void> {
    log.debug(`handling ${this.getName()}...`);

    if (!request.responseChannel) {
      request.responseChannel = `${this.getName()}:response`;
    }

    const {
      name,
      description,
      instructions,
      assistant,
      participant,
      triggers,
      cue,
      email,
    } = request.params;

    // Basic email validation
    if (email && !email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      event.sender.send(request.responseChannel, {
        error: 'Invalid email format',
      });
      return;
    }

    log.debug(`linking triggers: ${triggers}`);

    const exchange = new Exchange();
    exchange.name = name;
    exchange.description = description;
    exchange.instructions = instructions;
    exchange.cue = cue;
    exchange.email = email;

    const agentRepository = AppDataSource.getRepository(Agent);
    const savedAssistant = await agentRepository.findOneBy({ id: assistant });
    const savedParticipant = await agentRepository.findOneBy({
      id: participant,
    });
    if (savedAssistant) {
      exchange.assistant = savedAssistant;
    }
    if (savedParticipant) {
      exchange.participant = savedParticipant;
    }

    // todo: array should come from the front end
    const triggerRepository = AppDataSource.getRepository(Trigger);
    const savedTrigger = await triggerRepository.findOneBy({ id: triggers });
    if (savedTrigger) {
      exchange.triggers = [savedTrigger];
    }

    await AppDataSource.manager.save(exchange);
    event.sender.send(request.responseChannel, instanceToPlain(exchange));
  }
}
