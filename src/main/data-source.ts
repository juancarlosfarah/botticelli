import 'reflect-metadata';
import { DataSource } from 'typeorm';

import { Agent } from './entity/Agent';
import { ArtificialAgent } from './entity/ArtificialAgent';
import { ArtificialAssistant } from './entity/ArtificialAssistant';
import { ArtificialParticipant } from './entity/ArtificialParticipant';
import { Exchange } from './entity/Exchange';
import { ExchangeTemplate } from './entity/ExchangeTemplate';
import { Experiment } from './entity/Experiment';
import { HumanAgent } from './entity/HumanAgent';
import { HumanAssistant } from './entity/HumanAssistant';
import { HumanParticipant } from './entity/HumanParticipant';
import { Interaction } from './entity/Interaction';
import { Message } from './entity/Message';
import { Trigger } from './entity/Trigger';

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
    HumanAgent,
    HumanParticipant,
    HumanAssistant,
    Trigger,
    Interaction,
    Experiment,
  ],
  migrations: [],
  subscribers: [],
});
