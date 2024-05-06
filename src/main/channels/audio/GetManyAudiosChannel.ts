import { GET_MANY_AUDIOS_CHANNEL } from '@shared/channels';

import { Audio } from '../../entity/Audio';
import { GetManyChannel } from '../common/GetManyChannel';

export class GetManyAudiosChannel extends GetManyChannel {
  constructor() {
    super({
      name: GET_MANY_AUDIOS_CHANNEL,
      entity: Audio,
    });
  }
}
