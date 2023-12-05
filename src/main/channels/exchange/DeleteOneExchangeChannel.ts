import { DELETE_ONE_EXCHANGE_CHANNEL } from '@shared/channels';

import { Exchange } from '../../entity/Exchange';
import { DeleteOneChannel } from '../common/DeleteOneChannel';

export class DeleteOneExchangeChannel extends DeleteOneChannel {
  constructor() {
    super({
      name: DELETE_ONE_EXCHANGE_CHANNEL,
      entity: Exchange,
    });
  }
}
