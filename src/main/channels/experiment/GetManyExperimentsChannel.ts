import { GET_MANY_EXPERIMENTS_CHANNEL } from '@shared/channels';

import { Experiment } from '../../entity/Experiment';
import { GetManyChannel } from '../common/GetManyChannel';

export class GetManyExperimentsChannel extends GetManyChannel {
  constructor() {
    super({
      name: GET_MANY_EXPERIMENTS_CHANNEL,
      entity: Experiment,
    });
  }
}
