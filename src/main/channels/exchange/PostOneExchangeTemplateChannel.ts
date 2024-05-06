import { POST_ONE_EXCHANGE_TEMPLATE_CHANNEL } from '@shared/channels';
import { IpcRequest } from '@shared/interfaces/IpcRequest';
import { instanceToPlain } from 'class-transformer';
import { IpcMainEvent } from 'electron';
import log from 'electron-log/main';

import { PostOneExchangeTemplateParams } from '../../../shared/interfaces/ExchangeTemplate';
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

  async handle(
    event: IpcMainEvent,
    request: IpcRequest<PostOneExchangeTemplateParams>,
  ): Promise<void> {
    log.debug(`handling ${this.getName()}...`);

    if (!request.responseChannel) {
      request.responseChannel = `${this.getName()}:response`;
    }

    // todo: return error
    if (!request.params) {
      event.sender.send(request.responseChannel, {});
      return;
    }

    const {
      name,
      description,
      instructions,
      participantInstructionsOnComplete,
      assistant,
      cue,
      inputType,
      triggers,
      softLimit,
      hardLimit,
    } = request.params;

    log.debug(`linking triggers: ${triggers}`);

    const exchangeTemplate = new ExchangeTemplate();
    exchangeTemplate.name = name;
    exchangeTemplate.description = description;
    exchangeTemplate.instructions = instructions;
    exchangeTemplate.participantInstructionsOnComplete =
      participantInstructionsOnComplete;
    exchangeTemplate.cue = cue;
    exchangeTemplate.inputType = inputType;

    // limits
    if (softLimit) {
      exchangeTemplate.softLimit = softLimit;
    }
    if (hardLimit) {
      exchangeTemplate.hardLimit = hardLimit;
    }

    // todo: handle no assistant
    if (assistant) {
      const agentRepository = AppDataSource.getRepository(Agent);
      const savedAssistant = await agentRepository.findOneBy({ id: assistant });
      if (savedAssistant) {
        exchangeTemplate.assistant = savedAssistant;
      }
    }

    // todo: handle no triggers
    if (triggers) {
      const triggerRepository = AppDataSource.getRepository(Trigger);
      const savedTriggers: Trigger[] = [];
      for (const triggerId of triggers) {
        const savedTrigger = await triggerRepository.findOneBy({
          id: triggerId,
        });
        if (savedTrigger) {
          savedTriggers.push(savedTrigger);
        }
      }
      exchangeTemplate.triggers = savedTriggers;
    }

    await AppDataSource.manager.save(exchangeTemplate);
    event.sender.send(
      request.responseChannel,
      instanceToPlain(exchangeTemplate),
    );
  }
}
