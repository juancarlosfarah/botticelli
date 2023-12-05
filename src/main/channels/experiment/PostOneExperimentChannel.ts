import { POST_ONE_EXPERIMENT_CHANNEL } from '@shared/channels';
import { IpcRequest } from '@shared/interfaces/IpcRequest';
import { instanceToPlain } from 'class-transformer';
import { IpcMainEvent } from 'electron';
import log from 'electron-log/main';
import { In } from 'typeorm';

import { AppDataSource } from '../../data-source';
import { Agent } from '../../entity/Agent';
import { Experiment } from '../../entity/Experiment';
import { InteractionTemplate } from '../../entity/InteractionTemplate';
import { PostOneChannel } from '../common/PostOneChannel';

export class PostOneExperimentChannel extends PostOneChannel {
  constructor() {
    super({
      name: POST_ONE_EXPERIMENT_CHANNEL,
      entity: Experiment,
    });
  }

  async handle(event: IpcMainEvent, request: IpcRequest): Promise<void> {
    log.debug(`handling ${this.getName()}...`);

    if (!request.responseChannel) {
      request.responseChannel = `${this.getName()}:response`;
    }

    const { description, interactionTemplates, name, participants } =
      request.params;

    const experiment = new Experiment();
    experiment.name = name;
    experiment.description = description;

    const experimentRepository = AppDataSource.getRepository(Experiment);
    const interactionTemplateRepository =
      AppDataSource.getRepository(InteractionTemplate);
    const agentRepository = AppDataSource.getRepository(Agent);

    // interactions
    log.debug(`linking ${interactionTemplates?.length} interactions`);
    const savedInteractionTemplates =
      await interactionTemplateRepository.findBy({
        id: In(interactionTemplates),
      });
    experiment.interactionTemplates = savedInteractionTemplates;

    // participants
    log.debug(`linking ${participants?.length} participants`);
    const savedParticipants = await agentRepository.findBy({
      id: In(participants),
    });
    experiment.participants = savedParticipants;

    await experimentRepository.save(experiment);

    event.sender.send(request.responseChannel, instanceToPlain(experiment));
  }
}
