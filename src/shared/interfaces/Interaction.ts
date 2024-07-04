import Agent from './Agent';
import Exchange from './Exchange';
import Experiment from './Experiment';
import InteractionTemplate from './InteractionTemplate';

type Interaction = {
  id: string;
  description: string;
  modelInstructions: string;
  participantInstructions: string;
  participantInstructionsOnComplete: string;
  name: string;
  currentExchange: string;
  completed: boolean;
  started: boolean;
  experiment: Experiment;
  template: InteractionTemplate;
  participant: Agent;
  exchanges: Exchange[];
  startedAt: Date;
  completedAt: Date;
  createdAt: Date;
  updatedAt: Date;
};

export type NewInteractionParams = {
  description: string;
  modelInstructions: string;
  participantInstructions: string;
  participantInstructionsOnComplete: string;
  name: string;
  experiment: Experiment;
  template: InteractionTemplate;
  participant: Agent;
  exchanges: Exchange[];
};

export type GetOneInteractionParams = {
  id: string;
};

export type SetCurrentExchangeParams = {
  interactionId: string;
  currentExchangeId: string;
};

export default Interaction;
