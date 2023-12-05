import { DELETE_ONE_EXPERIMENT_CHANNEL } from '@shared/channels';

import { Experiment } from '../../entity/Experiment';
import { DeleteOneChannel } from '../common/DeleteOneChannel';

export class DeleteOneExperimentChannel extends DeleteOneChannel {
  constructor() {
    super({
      name: DELETE_ONE_EXPERIMENT_CHANNEL,
      entity: Experiment,
    });
  }
}
