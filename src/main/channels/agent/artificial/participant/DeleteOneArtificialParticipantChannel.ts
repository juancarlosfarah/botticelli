import { DELETE_ONE_ARTIFICIAL_PARTICIPANT_CHANNEL } from '../../../../../shared/channels';
import { ArtificialParticipant } from '../../../../entity/ArtificialParticipant';
import { DeleteOneChannel } from '../../../common/DeleteOneChannel';

export class DeleteOneArtificialParticipantChannel extends DeleteOneChannel {
  constructor() {
    super({
      name: DELETE_ONE_ARTIFICIAL_PARTICIPANT_CHANNEL,
      entity: ArtificialParticipant,
    });
  }
}
