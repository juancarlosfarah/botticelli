import 'reflect-metadata';
import { DataSource } from 'typeorm';

import { Agent } from './entity/Agent';
import { ArtificialAgent } from './entity/ArtificialAgent';
import { ArtificialAssistant } from './entity/ArtificialAssistant';
import { ArtificialEvaluator } from './entity/ArtificialEvaluator';
import { ArtificialParticipant } from './entity/ArtificialParticipant';
import { Event } from './entity/Event';
import { Exchange } from './entity/Exchange';
import { ExchangeTemplate } from './entity/ExchangeTemplate';
import { Experiment } from './entity/Experiment';
import { ExperimentInteractionTemplate } from './entity/ExperimentInteractionTemplate';
import { HumanAgent } from './entity/HumanAgent';
import { HumanAssistant } from './entity/HumanAssistant';
import { HumanParticipant } from './entity/HumanParticipant';
import { Interaction } from './entity/Interaction';
import { InteractionTemplate } from './entity/InteractionTemplate';
import { InteractionTemplateExchangeTemplate } from './entity/InteractionTemplateExchangeTemplate';
import { KeyPressEvent } from './entity/KeyPressEvent';
import { Message } from './entity/Message';
import { Simulation } from './entity/Simulation';
import { SimulationInteractionTemplate } from './entity/SimulationInteractionTemplate';
import { Trigger } from './entity/Trigger';
import { SocialCue } from './entity/SocialCue';

export const AppDataSource = new DataSource({
  type: 'sqlite',
  database: 'database.sqlite',
  synchronize: true,
  logging: false,
  entities: [
    Agent,
    Exchange,
    ExchangeTemplate,
    Message,
    ArtificialAgent,
    ArtificialAssistant,
    ArtificialParticipant,
    ArtificialEvaluator,
    HumanAgent,
    HumanParticipant,
    HumanAssistant,
    Trigger,
    Interaction,
    InteractionTemplate,
    Experiment,
    InteractionTemplateExchangeTemplate,
    ExperimentInteractionTemplate,
    Simulation,
    SimulationInteractionTemplate,
    SocialCue,
    Event,
    KeyPressEvent,
  ],
  migrations: [],
  subscribers: [],
});
