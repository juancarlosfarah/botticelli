import { DELETE_ONE_INTERACTION_TEMPLATE_CHANNEL } from '@shared/channels';

import { InteractionTemplate } from '../../entity/InteractionTemplate';
import { DeleteOneChannel } from '../common/DeleteOneChannel';

export class DeleteOneInteractionTemplateChannel extends DeleteOneChannel {
  constructor() {
    super({
      name: DELETE_ONE_INTERACTION_TEMPLATE_CHANNEL,
      entity: InteractionTemplate,
    });
  }
}
