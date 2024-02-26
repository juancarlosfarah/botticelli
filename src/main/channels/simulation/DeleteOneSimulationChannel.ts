import { DELETE_ONE_SIMULATION_CHANNEL } from '@shared/channels';

import { Simulation } from '../../entity/Simulation';
import { DeleteOneChannel } from '../common/DeleteOneChannel';

export class DeleteOneSimulationChannel extends DeleteOneChannel {
  constructor() {
    super({
      name: DELETE_ONE_SIMULATION_CHANNEL,
      entity: Simulation,
    });
  }
}
