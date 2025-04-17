import AgentType from './AgentType';

type Agent = {
  id: string;
  type: AgentType;
  description: string;
  name: string;
  email: string;
};

export type PatchOneAgentParams = {
  id: string;
  name?: string;
  description?: string;
};

export default Agent;
