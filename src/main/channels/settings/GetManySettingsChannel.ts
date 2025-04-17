import { Setting } from '@main/entity/Setting';
import { GET_MANY_SETTINGS_CHANNEL } from '@shared/channels';

import { GetManyChannel } from '../common/GetManyChannel';

export class GetManySettingsChannel extends GetManyChannel {
  constructor() {
    super({
      name: GET_MANY_SETTINGS_CHANNEL,
      entity: Setting,
    });
  }
}
