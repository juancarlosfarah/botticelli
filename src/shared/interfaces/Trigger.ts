import Agent from './Agent';

type Trigger = {
  id: number;
  description: string;
  criteria: string;
  name: string;
  evaluator: Agent;
};

export default Trigger;
