import Agent from './Agent';

type Trigger = {
  id: string;
  description: string;
  criteria: string;
  name: string;
  evaluator: Agent;
  email: string;
};

export type PatchOneTriggerParams = {
  id: string;
  name?: string;
  description?: string;
};

export default Trigger;
