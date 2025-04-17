import { Setting } from '@main/entity/Setting';
import { GET_ONE_SETTING_CHANNEL } from '@shared/channels';

import { GetOneChannel } from '../common/GetOneChannel';

export class GetOneSettingChannel extends GetOneChannel {
  constructor() {
    super({
      name: GET_ONE_SETTING_CHANNEL,
      entity: Setting,
    });
  }
}
