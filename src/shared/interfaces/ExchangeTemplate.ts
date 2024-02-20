import Agent from './Agent';
import Trigger from './Trigger';

type ExchangeTemplate = {
  id: string;
  name: string;
  description: string;
  instructions: string;
  participantInstructionsOnComplete: string;
  cue: string;
  assistant: Agent;
  triggers: Trigger[];
  softLimit: number;
  hardLimit: number;
};

export type PostOneExchangeTemplateResponse = ExchangeTemplate;

export type GetOneExchangeTemplateResponse = ExchangeTemplate;

export type GetManyExchangeTemplateResponse = ExchangeTemplate[];

export type PostOneExchangeTemplateParams = {
  name: string;
  description: string;
  instructions: string;
  participantInstructionsOnComplete: string;
  assistant: string | null;
  triggers: string[];
  cue: string;
  softLimit?: number;
  hardLimit?: number;
};

export type GetOneExchangeTemplateParams = {
  id: string;
};

export type DeleteOneExchangeParams = string;

export default ExchangeTemplate;
