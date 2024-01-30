import Agent from './Agent';
import ExchangeTemplate from './ExchangeTemplate';
import Interaction from './Interaction';
import { Message } from './Message';
import Trigger from './Trigger';

type Exchange = {
  id: string;
  name: string;
  description: string;
  instructions: string;
  cue: string;
  messages: Message[];
  assistant: Agent;
  interaction: Interaction;
  triggers: Trigger[];
  template: ExchangeTemplate;
  started: boolean;
  completed: boolean;
  startedAt: Date;
  completedAt: Date;
  createdAt: Date;
  updatedAt: Date;
};

export type ExchangeQuery = {
  id: string;
};

export type ExchangeResponse = {
  exchange: Exchange;
};

export type ExchangesResponse = {
  exchanges: Exchange[];
};

export default Exchange;
