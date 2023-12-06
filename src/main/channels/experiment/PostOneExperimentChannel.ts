import { POST_ONE_EXPERIMENT_CHANNEL } from '@shared/channels';
import { IpcRequest } from '@shared/interfaces/IpcRequest';
import { instanceToPlain } from 'class-transformer';
import { IpcMainEvent } from 'electron';
import log from 'electron-log/main';
import _ from 'lodash';
import { In } from 'typeorm';

import { AppDataSource } from '../../data-source';
import { Agent } from '../../entity/Agent';
import { Exchange } from '../../entity/Exchange';
import { Experiment } from '../../entity/Experiment';
import { Interaction } from '../../entity/Interaction';
import { InteractionTemplate } from '../../entity/InteractionTemplate';
import { Message } from '../../entity/Message';
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
    const interactionRepository = AppDataSource.getRepository(Interaction);
    const agentRepository = AppDataSource.getRepository(Agent);
    const exchangeRepository = AppDataSource.getRepository(Exchange);
    const messageRepository = AppDataSource.getRepository(Message);

    // interactions
    log.debug(`linking ${interactionTemplates?.length} interactions`);
    const savedInteractionTemplates = await interactionTemplateRepository.find({
      where: {
        id: In(interactionTemplates),
      },
      relations: {
        exchangeTemplates: {
          triggers: true,
        },
      },
    });

    experiment.interactionTemplates = savedInteractionTemplates;

    // participants
    log.debug(`linking ${participants?.length} participants`);
    const savedParticipants = await agentRepository.findBy({
      id: In(participants),
    });
    experiment.participants = savedParticipants;

    // save the experiment with basic properties
    let savedExperiment = await experimentRepository.save(experiment);

    // accumulate saved interactions
    const savedInteractions: Interaction[] = [];

    // each participant gets their own interaction for each interaction template
    if (savedInteractionTemplates.length) {
      for (const savedInteractionTemplate of savedInteractionTemplates) {
        // todo: add order
        const exchangeTemplates = _.orderBy(
          savedInteractionTemplate.exchangeTemplates,
          'createdAt',
          'desc',
        );
        if (savedParticipants.length) {
          for (const savedParticipant of savedParticipants) {
            // basic interaction data
            const interaction = new Interaction();
            interaction.name = savedInteractionTemplate.name;
            interaction.description = savedInteractionTemplate.description;
            interaction.participant = savedParticipant;
            interaction.instructions = savedInteractionTemplate.instructions;
            interaction.template = savedInteractionTemplate;
            interaction.experiment = savedExperiment;

            let savedInteraction =
              await interactionRepository.save(interaction);
            log.debug(`saved interaction ${savedInteraction.id}`);

            log.debug(`creating exchanges from templates:`, exchangeTemplates);
            const savedExchanges: Exchange[] = [];

            const numExchanges = exchangeTemplates.length;
            if (numExchanges) {
              let exchangeTemplateNumber = numExchanges - 1;
              let exchangeNumber = 0;
              // create an exchange from each of the interaction's exchange templates
              for (const exchangeTemplate of exchangeTemplates) {
                const exchange = new Exchange();
                exchange.template = exchangeTemplate;
                exchange.name = exchangeTemplate.name;
                exchange.instructions = exchangeTemplate.instructions;
                exchange.cue = exchangeTemplate.cue;
                exchange.triggers = exchangeTemplate.triggers;
                exchange.assistant = exchangeTemplate.assistant;
                exchange.description = exchangeTemplate.description;
                exchange.interaction = savedInteraction;
                if (exchangeTemplateNumber < numExchanges - 1) {
                  exchange.next = savedExchanges[exchangeNumber - 1].id;
                }
                exchangeNumber++;
                exchangeTemplateNumber--;
                const savedExchange = await exchangeRepository.save(exchange);
                log.debug(`saved exchange ${savedExchange.id}`);
                savedExchanges.push(savedExchange);

                // todo: do this when the exchange is started
                if (exchange.cue) {
                  // debugging
                  log.debug(`creating cue:`, exchange.cue);
                  const message = new Message();
                  message.exchange = savedExchange;
                  message.content = exchange.cue;
                  message.sender = exchange.assistant;
                  await messageRepository.save(message);
                }
              }
            }
            // todo: do this when the interaction is started
            if (savedExchanges.length) {
              savedInteraction.currentExchange =
                savedExchanges[savedExchanges.length - 1].id;
            }
            // note: no need to save the exchanges back on the interaction
            savedInteraction =
              await interactionRepository.save(savedInteraction);
            savedInteractions.push(savedInteraction);
          }
        }
      }
    }

    // note: no need to save the interactions back on the experiment
    savedExperiment = await experimentRepository.save(savedExperiment);

    event.sender.send(
      request.responseChannel,
      instanceToPlain(savedExperiment),
    );
  }
}
