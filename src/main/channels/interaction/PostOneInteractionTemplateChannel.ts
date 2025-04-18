import { POST_ONE_INTERACTION_TEMPLATE_CHANNEL } from '@shared/channels';
import { PostOneInteractionTemplateParams } from '@shared/interfaces/InteractionTemplate';
import { IpcRequest } from '@shared/interfaces/IpcRequest';
import { instanceToPlain } from 'class-transformer';
import { IpcMainEvent } from 'electron';
import log from 'electron-log/main';

import { AppDataSource } from '../../data-source';
import { ExchangeTemplate } from '../../entity/ExchangeTemplate';
import { InteractionTemplate } from '../../entity/InteractionTemplate';
import { InteractionTemplateExchangeTemplate } from '../../entity/InteractionTemplateExchangeTemplate';
import { PostOneChannel } from '../common/PostOneChannel';

export class PostOneInteractionTemplateChannel extends PostOneChannel {
  constructor() {
    super({
      name: POST_ONE_INTERACTION_TEMPLATE_CHANNEL,
      entity: InteractionTemplate,
    });
  }

  async handle(
    event: IpcMainEvent,
    request: IpcRequest<PostOneInteractionTemplateParams>,
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
      description,
      modelInstructions,
      participantInstructions,
      name,
      exchangeTemplates,
      participantInstructionsOnComplete,
      email,
    } = request.params;

    if (!email) {
      event.sender.send(request.responseChannel, {
        error: 'Missing email',
      });
      return;
    }

    // Basic email validation
    if (email && !email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      event.sender.send(request.responseChannel, {
        error: 'Invalid email format',
      });
      return;
    }

    const interactionTemplate = new InteractionTemplate();
    interactionTemplate.name = name;
    interactionTemplate.description = description;
    interactionTemplate.modelInstructions = modelInstructions;
    interactionTemplate.participantInstructions = participantInstructions;
    interactionTemplate.participantInstructionsOnComplete =
      participantInstructionsOnComplete;
    interactionTemplate.email = email;

    const interactionTemplateRepository =
      AppDataSource.getRepository(InteractionTemplate);
    const exchangeTemplateRepository =
      AppDataSource.getRepository(ExchangeTemplate);
    const interactionTemplateExchangeTemplateRepository =
      AppDataSource.getRepository(InteractionTemplateExchangeTemplate);

    log.debug(`linking exchange templates:`, exchangeTemplates);

    const savedInteractionTemplate =
      await interactionTemplateRepository.save(interactionTemplate);

    const interactionTemplateExchangeTemplates: InteractionTemplateExchangeTemplate[] =
      [];

    let index = 0;
    for (const exchangeTemplateId of exchangeTemplates) {
      const interactionTemplateExchangeTemplate =
        new InteractionTemplateExchangeTemplate();
      interactionTemplateExchangeTemplate.order = index;
      const exchangeTemplate = await exchangeTemplateRepository.findOneBy({
        id: exchangeTemplateId,
      });
      if (exchangeTemplate) {
        interactionTemplateExchangeTemplate.exchangeTemplate = exchangeTemplate;
      }
      interactionTemplateExchangeTemplate.interactionTemplate =
        savedInteractionTemplate;
      interactionTemplateExchangeTemplates.push(
        interactionTemplateExchangeTemplate,
      );
      index++;
    }
    await interactionTemplateExchangeTemplateRepository.save(
      interactionTemplateExchangeTemplates,
    );

    const response = await interactionTemplateRepository.findOneBy({
      id: savedInteractionTemplate.id,
    });

    event.sender.send(request.responseChannel, instanceToPlain(response));
  }
}
