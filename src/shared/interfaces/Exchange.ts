import InputType from '../enums/InputType';
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
  participantInstructionsOnComplete: string;
  cue: string;
  inputType: InputType;
  order: number;
  messages: Message[];
  assistant: Agent;
  interaction: Interaction;
  triggers: Trigger[];
  template: ExchangeTemplate;
  started: boolean;
  completed: boolean;
  dismissed: boolean;
  softLimit: number;
  hardLimit: number;
  startedAt: Date;
  completedAt: Date;
  dismissedAt: Date;
  createdAt: Date;
  updatedAt: Date;
  email: string;
};

export type ExchangeQuery = {
  id: string;
  email: string;
};

export type ExchangeResponse = Exchange;

export type ExchangesResponse = Exchange[];

export default Exchange;
