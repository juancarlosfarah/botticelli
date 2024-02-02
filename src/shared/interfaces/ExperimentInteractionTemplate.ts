import Experiment from './Experiment';
import InteractionTemplate from './InteractionTemplate';

type ExperimentInteractionTemplate = {
  id: string;
  order: number;
  experiment: Experiment;
  interactionTemplate: InteractionTemplate;
};

export default ExperimentInteractionTemplate;
