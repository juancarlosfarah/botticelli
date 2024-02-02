import Agent from './Agent';
import ExperimentInteractionTemplate from './ExperimentInteractionTemplate';
import Interaction from './Interaction';

type Experiment = {
  id: string;
  description: string;
  name: string;
  interactions: Interaction[];
  interactionTemplates: ExperimentInteractionTemplate[];
  participants: Agent[];
};

export type PostOneExperimentParams = {
  description: string;
  name: string;
  // ids
  interactionTemplates: string[];
  participants: string[];
};

export type GetOneExperimentQuery = {
  query: {
    id: string;
  };
};

export default Experiment;
