import Agent from './Agent';
import Interaction from './Interaction';
import InteractionTemplate from './InteractionTemplate';

type Experiment = {
  id: string;
  description: string;
  name: string;
  interactions: Interaction[];
  interactionTemplates: InteractionTemplate[];
  participants: Agent[];
};

export default Experiment;
