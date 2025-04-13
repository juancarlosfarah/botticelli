import Agent from './Agent';

type Trigger = {
  id: string;
  description: string;
  criteria: string;
  name: string;
  evaluator: Agent;
  email: string;
};

export default Trigger;
