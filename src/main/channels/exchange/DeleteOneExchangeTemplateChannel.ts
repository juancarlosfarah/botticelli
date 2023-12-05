import { DELETE_ONE_EXCHANGE_TEMPLATE_CHANNEL } from '@shared/channels';

import { ExchangeTemplate } from '../../entity/ExchangeTemplate';
import { DeleteOneChannel } from '../common/DeleteOneChannel';

export class DeleteOneExchangeTemplateChannel extends DeleteOneChannel {
  constructor() {
    super({
      name: DELETE_ONE_EXCHANGE_TEMPLATE_CHANNEL,
      entity: ExchangeTemplate,
    });
  }
}
