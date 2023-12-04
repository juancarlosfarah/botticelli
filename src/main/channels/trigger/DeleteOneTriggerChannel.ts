import { DELETE_ONE_TRIGGER_CHANNEL } from '@shared/channels';

import { Trigger } from '../../entity/Trigger';
import { DeleteOneChannel } from '../common/DeleteOneChannel';

export class DeleteOneTriggerChannel extends DeleteOneChannel {
  constructor() {
    super({
      name: DELETE_ONE_TRIGGER_CHANNEL,
      entity: Trigger,
    });
  }
}
