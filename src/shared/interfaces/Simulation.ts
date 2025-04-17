import Agent from './Agent';
import Interaction from './Interaction';
import SimulationInteractionTemplate from './SimulationInteractionTemplate';

type Simulation = {
  id: string;
  description: string;
  name: string;
  interactions: Interaction[];
  interactionTemplates: SimulationInteractionTemplate[];
  participants: Agent[];
  createdAt: Date;
  updatedAt: Date;
  email: string;
};

export type PostOneSimulationParams = {
  description: string;
  name: string;
  email: string;
  // ids
  interactionTemplates: string[];
  participants: string[];
};

export type GetOneSimulationParams = {
  id: string;
};

export type DeleteOneSimulationParams = string;

// responses are currently simulations
export type PostOneSimulationResponse = Simulation;
export type GetOneSimulationResponse = Simulation;
export type GetManySimulationsResponse = Simulation[];
// response is a string
export type DeleteOneSimulationResponse = string;

export default Simulation;
