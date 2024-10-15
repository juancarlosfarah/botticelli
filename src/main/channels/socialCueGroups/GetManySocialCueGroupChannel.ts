import { GET_MANY_SOCIALCUEGROUPS_CHANNEL } from '@shared/channels';

import { SocialCueGroup } from '../../entity/SocialCueGroup';
import { GetManyChannel } from '../common/GetManyChannel';

export class GetManySocialCueGroupChannel extends GetManyChannel {
  constructor() {
    super({
      name: GET_MANY_SOCIALCUEGROUPS_CHANNEL,
      entity: SocialCueGroup,
    });
  }
}
