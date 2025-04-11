import { GET_ONE_HUMAN_ASSISTANT_CHANNEL } from '@shared/channels';

import { HumanAssistant } from '../../../../entity/HumanAssistant';
import { GetOneChannel } from '../../../common/GetOneChannel';

export class GetOneHumanAssistantChannel extends GetOneChannel {
  constructor() {
    super({
      name: GET_ONE_HUMAN_ASSISTANT_CHANNEL,
      entity: HumanAssistant,
    });
  }
}
