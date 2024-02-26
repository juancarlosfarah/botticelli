import InteractionTemplate from './InteractionTemplate';
import Simulation from './Simulation';

type SimulationInteractionTemplate = {
  id: string;
  order: number;
  simulation: Simulation;
  interactionTemplate: InteractionTemplate;
};

export default SimulationInteractionTemplate;
