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
  email: string;
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
  email: string;
};

export type GetOneInteractionParams = {
  id: string;
};

export type SetCurrentExchangeParams = {
  interactionId: string;
  currentExchangeId: string;
};

export type PatchOneInteractionParams = {
  id: string;
  name?: string;
  description?: string;
};

export default Interaction;
