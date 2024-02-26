import { GET_MANY_SIMULATIONS_CHANNEL } from '@shared/channels';

import { Simulation } from '../../entity/Simulation';
import { GetManyChannel } from '../common/GetManyChannel';

export class GetManySimulationsChannel extends GetManyChannel {
  constructor() {
    super({
      name: GET_MANY_SIMULATIONS_CHANNEL,
      entity: Simulation,
    });
  }
}
