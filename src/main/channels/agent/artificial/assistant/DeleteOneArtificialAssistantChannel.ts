import { DELETE_ONE_ARTIFICIAL_ASSISTANT_CHANNEL } from '@shared/channels';

import { ArtificialAssistant } from '../../../../entity/ArtificialAssistant';
import { DeleteOneChannel } from '../../../common/DeleteOneChannel';

export class DeleteOneArtificialAssistantChannel extends DeleteOneChannel {
  constructor() {
    super({
      name: DELETE_ONE_ARTIFICIAL_ASSISTANT_CHANNEL,
      entity: ArtificialAssistant,
    });
  }
}
