import Agent from './Agent';
import Exchange from './Exchange';
import Experiment from './Experiment';
import InteractionTemplate from './InteractionTemplate';

type Interaction = {
  id: string;
  description: string;
  modelInstructions: string;
  participantInstructions: string;
  name: string;
  currentExchange: string;
  completed: boolean;
  experiment: Experiment;
  template: InteractionTemplate;
  participant: Agent;
  exchanges: Exchange[];
};

export default Interaction;
