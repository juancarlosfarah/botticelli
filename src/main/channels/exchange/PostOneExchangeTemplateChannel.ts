import { POST_ONE_EXCHANGE_TEMPLATE_CHANNEL } from '@shared/channels';
import { IpcRequest } from '@shared/interfaces/IpcRequest';
import { instanceToPlain } from 'class-transformer';
import { IpcMainEvent } from 'electron';
import log from 'electron-log/main';

import { AppDataSource } from '../../data-source';
import { Agent } from '../../entity/Agent';
import { ExchangeTemplate } from '../../entity/ExchangeTemplate';
import { Trigger } from '../../entity/Trigger';
import { PostOneChannel } from '../common/PostOneChannel';

export class PostOneExchangeTemplateChannel extends PostOneChannel {
  constructor() {
    super({
      name: POST_ONE_EXCHANGE_TEMPLATE_CHANNEL,
      entity: ExchangeTemplate,
    });
  }

  async handle(event: IpcMainEvent, request: IpcRequest): Promise<void> {
    log.debug(`handling ${this.getName()}...`);

    if (!request.responseChannel) {
      request.responseChannel = `${this.getName()}:response`;
    }

    const { name, description, instructions, assistant, cue, triggers } =
      request.params;

    log.debug(`linking triggers: ${triggers}`);

    const exchangeTemplate = new ExchangeTemplate();
    exchangeTemplate.name = name;
    exchangeTemplate.description = description;
    exchangeTemplate.instructions = instructions;
    exchangeTemplate.cue = cue;

    const agentRepository = AppDataSource.getRepository(Agent);
    const savedAssistant = await agentRepository.findOneBy({ id: assistant });
    if (savedAssistant) {
      exchangeTemplate.assistant = savedAssistant;
    }

    // todo: array should come from the front end
    const triggerRepository = AppDataSource.getRepository(Trigger);
    const savedTrigger = await triggerRepository.findOneBy({ id: triggers });
    if (savedTrigger) {
      exchangeTemplate.triggers = [savedTrigger];
    }

    await AppDataSource.manager.save(exchangeTemplate);
    event.sender.send(
      request.responseChannel,
      instanceToPlain(exchangeTemplate),
    );
  }
}
