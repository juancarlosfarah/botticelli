import { ArtificialEvaluator } from '@main/entity/ArtificialEvaluator';
import { GET_MANY_ARTIFICIAL_EVALUATORS_CHANNEL } from '@shared/channels';

import { GetManyChannel } from '../../../common/GetManyChannel';

export class GetManyArtificialEvaluatorsChannel extends GetManyChannel {
  constructor() {
    super({
      name: GET_MANY_ARTIFICIAL_EVALUATORS_CHANNEL,
      entity: ArtificialEvaluator,
    });
  }
}
