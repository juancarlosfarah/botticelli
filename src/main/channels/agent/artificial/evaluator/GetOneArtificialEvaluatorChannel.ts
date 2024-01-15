import { ArtificialEvaluator } from '@main/entity/ArtificialEvaluator';
import { GET_ONE_ARTIFICIAL_EVALUATOR_CHANNEL } from '@shared/channels';

import { GetOneChannel } from '../../../common/GetOneChannel';

export class GetOneArtificialEvaluatorChannel extends GetOneChannel {
  constructor() {
    super({
      name: GET_ONE_ARTIFICIAL_EVALUATOR_CHANNEL,
      entity: ArtificialEvaluator,
    });
  }
}
