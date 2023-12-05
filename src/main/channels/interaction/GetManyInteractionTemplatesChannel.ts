import { GET_MANY_INTERACTION_TEMPLATES_CHANNEL } from '@shared/channels';

import { InteractionTemplate } from '../../entity/InteractionTemplate';
import { GetManyChannel } from '../common/GetManyChannel';

export class GetManyInteractionTemplatesChannel extends GetManyChannel {
  constructor() {
    super({
      name: GET_MANY_INTERACTION_TEMPLATES_CHANNEL,
      entity: InteractionTemplate,
    });
  }
}
