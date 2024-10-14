import { GET_MANY_SOCIALCUES_CHANNEL } from '@shared/channels';

import { SocialCue } from '../../entity/SocialCue';
import { GetManyChannel } from '../common/GetManyChannel';

export class GetManySocialCueChannel extends GetManyChannel {
  constructor() {
    super({
      name: GET_MANY_SOCIALCUES_CHANNEL,
      entity: SocialCue,
    });
  }
}
