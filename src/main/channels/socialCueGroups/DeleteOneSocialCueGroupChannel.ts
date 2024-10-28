import { DELETE_ONE_SOCIAL_CUE_GROUP_CHANNEL } from '@shared/channels';

import { SocialCueGroup } from '../../entity/SocialCueGroup';
import { DeleteOneChannel } from '../common/DeleteOneChannel';

export class DeleteOneSocialCueGroupChannel extends DeleteOneChannel {
  constructor() {
    super({
      name: DELETE_ONE_SOCIAL_CUE_GROUP_CHANNEL,
      entity: SocialCueGroup,
    });
  }
}
