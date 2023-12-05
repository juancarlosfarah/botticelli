import Agent from './Agent';
import Interaction from './Interaction';

type Experiment = {
  id: string;
  description: string;
  name: string;
  interactions: Interaction[];
  participants: Agent[];
};

export default Experiment;
