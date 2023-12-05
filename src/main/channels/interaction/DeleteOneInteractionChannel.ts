import { DELETE_ONE_INTERACTION_CHANNEL } from '@shared/channels';

import { Interaction } from '../../entity/Interaction';
import { DeleteOneChannel } from '../common/DeleteOneChannel';

export class DeleteOneInteractionChannel extends DeleteOneChannel {
  constructor() {
    super({
      name: DELETE_ONE_INTERACTION_CHANNEL,
      entity: Interaction,
    });
  }
}
