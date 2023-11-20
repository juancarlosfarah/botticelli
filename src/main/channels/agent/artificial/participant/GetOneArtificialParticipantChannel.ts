import { ArtificialParticipant } from '@main/entity/ArtificialParticipant';
import { GET_ONE_ARTIFICIAL_PARTICIPANT_CHANNEL } from '@shared/channels';

import { GetOneChannel } from '../../../common/GetOneChannel';

export class GetOneArtificialParticipantChannel extends GetOneChannel {
  constructor() {
    super({
      name: GET_ONE_ARTIFICIAL_PARTICIPANT_CHANNEL,
      entity: ArtificialParticipant,
    });
  }
}
