import { GET_MANY_EXCHANGES_CHANNEL } from '../../../shared/channels';
import { Exchange } from '../../entity/Exchange';
import { GetManyChannel } from '../common/GetManyChannel';

export class GetManyExchangesChannel extends GetManyChannel {
  constructor() {
    super({
      name: GET_MANY_EXCHANGES_CHANNEL,
      entity: Exchange,
    });
  }
}
