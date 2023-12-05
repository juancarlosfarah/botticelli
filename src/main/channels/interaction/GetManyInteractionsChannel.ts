import { GET_MANY_INTERACTIONS_CHANNEL } from '@shared/channels';

import { Interaction } from '../../entity/Interaction';
import { GetManyChannel } from '../common/GetManyChannel';

export class GetManyInteractionsChannel extends GetManyChannel {
  constructor() {
    super({
      name: GET_MANY_INTERACTIONS_CHANNEL,
      entity: Interaction,
    });
  }
}
