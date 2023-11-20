import { GET_ONE_ARTIFICIAL_ASSISTANT_CHANNEL } from '@shared/channels';

import { ArtificialAssistant } from '../../../../entity/ArtificialAssistant';
import { GetOneChannel } from '../../../common/GetOneChannel';

export class GetOneArtificialAssistantChannel extends GetOneChannel {
  constructor() {
    super({
      name: GET_ONE_ARTIFICIAL_ASSISTANT_CHANNEL,
      entity: ArtificialAssistant,
    });
  }
}
