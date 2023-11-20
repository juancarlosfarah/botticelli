import { ArtificialAssistant } from '@main/entity/ArtificialAssistant';
import { GET_MANY_ARTIFICIAL_ASSISTANTS_CHANNEL } from '@shared/channels';

import { GetManyChannel } from '../../../common/GetManyChannel';

export class GetManyArtificialAssistantChannel extends GetManyChannel {
  constructor() {
    super({
      name: GET_MANY_ARTIFICIAL_ASSISTANTS_CHANNEL,
      entity: ArtificialAssistant,
    });
  }
}
