import { Trigger } from '@main/entity/Trigger';
import { GET_ONE_TRIGGER_CHANNEL } from '@shared/channels';

import { GetOneChannel } from '../common/GetOneChannel';

export class GetOneTriggerChannel extends GetOneChannel {
  constructor() {
    super({
      name: GET_ONE_TRIGGER_CHANNEL,
      entity: Trigger,
    });
  }
}
