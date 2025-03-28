import { Trigger } from '@main/entity/Trigger';
import { POST_ONE_TRIGGER_CHANNEL } from '@shared/channels';
import { IpcRequest } from '@shared/interfaces/IpcRequest';
import { instanceToPlain } from 'class-transformer';
import { IpcMainEvent } from 'electron';
import log from 'electron-log/main';

import { AppDataSource } from '../../data-source';
import { Agent } from '../../entity/Agent';
import { PostOneChannel } from '../common/PostOneChannel';

export class PostOneTriggerChannel extends PostOneChannel {
  constructor() {
    super({
      name: POST_ONE_TRIGGER_CHANNEL,
      entity: Trigger,
    });
  }

  async handle(event: IpcMainEvent, request: IpcRequest): Promise<void> {
    log.debug(`handling ${this.getName()}...`);

    if (!request.responseChannel) {
      request.responseChannel = `${this.getName()}:response`;
    }

    const { description, criteria, name, evaluator, email } = request.params;

    const trigger = new Trigger();
    trigger.name = name;
    trigger.description = description;
    trigger.criteria = criteria;
    trigger.email = email;

    const agentRepository = AppDataSource.getRepository(Agent);
    const savedEvaluator = await agentRepository.findOneBy({ id: evaluator });

    if (savedEvaluator) {
      trigger.evaluator = savedEvaluator;
    }

    await AppDataSource.manager.save(trigger);
    event.sender.send(request.responseChannel, instanceToPlain(trigger));
  }
}
