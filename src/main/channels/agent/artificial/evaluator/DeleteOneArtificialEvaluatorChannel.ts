import { ArtificialEvaluator } from '@main/entity/ArtificialEvaluator';
import { DELETE_ONE_ARTIFICIAL_EVALUATOR_CHANNEL } from '@shared/channels';

import { DeleteOneChannel } from '../../../common/DeleteOneChannel';

export class DeleteOneArtificialEvaluatorChannel extends DeleteOneChannel {
  constructor() {
    super({
      name: DELETE_ONE_ARTIFICIAL_EVALUATOR_CHANNEL,
      entity: ArtificialEvaluator,
    });
  }
}
