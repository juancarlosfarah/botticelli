import { IpcRequest } from '@shared/interfaces/IpcRequest';
import { instanceToPlain } from 'class-transformer';
import { IpcMainEvent } from 'electron';
import log from 'electron-log/main';
import { EntityTarget, ObjectLiteral } from 'typeorm';

import { AppDataSource } from '../../data-source';
import { IpcChannel } from '../../interfaces/IpcChannel';

type GetOneChannelType = {
  name: string;
  entity: EntityTarget<ObjectLiteral>;
};

export abstract class GetOneChannel implements IpcChannel {
  name: string;
  entity: EntityTarget<ObjectLiteral>;

  protected constructor({ name, entity }: GetOneChannelType) {
    this.name = name;
    this.entity = entity;
  }

  getName(): string {
    return this.name;
  }

  async handle(event: IpcMainEvent, request: IpcRequest): Promise<void> {
    log.debug(`handling ${this.name}...`);

    if (!request.responseChannel) {
      request.responseChannel = `${this.name}:response`;
    }

    // todo: error handling
    const query = request?.params?.query;

    // debugging
    log.debug(`using query:`, query);

    const repository = AppDataSource.getRepository(this.entity);
    const instance = await repository.findOneBy(query);

    // debugging
    log.debug(`got ${this.entity}:`, instance);

    event.sender.send(request.responseChannel, instanceToPlain(instance));
  }
}
