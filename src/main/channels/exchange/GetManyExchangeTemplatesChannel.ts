import { GET_MANY_EXCHANGE_TEMPLATES_CHANNEL } from '../../../shared/channels';
import { ExchangeTemplate } from '../../entity/ExchangeTemplate';
import { GetManyChannel } from '../common/GetManyChannel';

export class GetManyExchangeTemplatesChannel extends GetManyChannel {
  constructor() {
    super({
      name: GET_MANY_EXCHANGE_TEMPLATES_CHANNEL,
      entity: ExchangeTemplate,
    });
  }
}
