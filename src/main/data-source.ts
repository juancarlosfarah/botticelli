import 'reflect-metadata';
import { DataSource } from 'typeorm';

import { Agent } from './entity/Agent';
import { ArtificialAgent } from './entity/ArtificialAgent';
import { ArtificialAssistant } from './entity/ArtificialAssistant';
import { ArtificialParticipant } from './entity/ArtificialParticipant';
import { Conversation } from './entity/Conversation';
import { HumanAgent } from './entity/HumanAgent';
import { HumanAssistant } from './entity/HumanAssistant';
import { HumanParticipant } from './entity/HumanParticipant';
import { Message } from './entity/Message';
import { Trigger } from './entity/Trigger';

export const AppDataSource = new DataSource({
  type: 'sqlite',
  database: 'database.sqlite',
  synchronize: true,
  logging: false,
  entities: [
    Agent,
    Conversation,
    Message,
    ArtificialAgent,
    ArtificialAssistant,
    ArtificialParticipant,
    HumanAgent,
    HumanParticipant,
    HumanAssistant,
    Trigger,
  ],
  migrations: [],
  subscribers: [],
});
