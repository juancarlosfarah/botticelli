import { Trigger } from '@main/entity/Trigger';
import { GET_MANY_TRIGGERS_CHANNEL } from '@shared/channels';

import { GetManyChannel } from '../common/GetManyChannel';

export class GetManyTriggersChannel extends GetManyChannel {
  constructor() {
    super({
      name: GET_MANY_TRIGGERS_CHANNEL,
      entity: Trigger,
    });
  }
}

///// do something to filter the triggers with respect to the user
