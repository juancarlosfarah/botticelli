import { DELETE_ONE_AUDIO_CHANNEL } from '@shared/channels';

import { Audio } from '../../entity/Audio';
import { DeleteOneChannel } from '../common/DeleteOneChannel';

export class DeleteOneAudioChannel extends DeleteOneChannel {
  constructor() {
    super({
      name: DELETE_ONE_AUDIO_CHANNEL,
      entity: Audio,
    });
  }
}
