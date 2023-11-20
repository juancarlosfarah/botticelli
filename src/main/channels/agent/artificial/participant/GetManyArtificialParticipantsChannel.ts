import { GET_MANY_ARTIFICIAL_PARTICIPANTS_CHANNEL } from '@shared/channels';

import { ArtificialParticipant } from '../../../../entity/ArtificialParticipant';
import { GetManyChannel } from '../../../common/GetManyChannel';

export class GetManyArtificialParticipantsChannel extends GetManyChannel {
  constructor() {
    super({
      name: GET_MANY_ARTIFICIAL_PARTICIPANTS_CHANNEL,
      entity: ArtificialParticipant,
    });
  }
}
