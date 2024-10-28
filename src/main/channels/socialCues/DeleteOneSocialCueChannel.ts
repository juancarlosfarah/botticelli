import { DELETE_ONE_SOCIAL_CUE_CHANNEL } from '@shared/channels';

import { SocialCue } from '../../entity/SocialCue';
import { DeleteOneChannel } from '../common/DeleteOneChannel';

export class DeleteOneSocialCueChannel extends DeleteOneChannel {
  constructor() {
    super({
      name: DELETE_ONE_SOCIAL_CUE_CHANNEL,
      entity: SocialCue,
    });
  }
}
