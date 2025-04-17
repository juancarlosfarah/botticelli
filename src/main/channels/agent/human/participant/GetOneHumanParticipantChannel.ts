import { GET_ONE_HUMAN_PARTICIPANT_CHANNEL } from '@shared/channels';

import { HumanParticipant } from '../../../../entity/HumanParticipant';
import { GetOneChannel } from '../../../common/GetOneChannel';

export class GetOneHumanParticipantChannel extends GetOneChannel {
  constructor() {
    super({
      name: GET_ONE_HUMAN_PARTICIPANT_CHANNEL,
      entity: HumanParticipant,
    });
  }
}
