import { IpcRequest } from '@shared/interfaces/IpcRequest';
import { instanceToPlain } from 'class-transformer';
import { IpcMainEvent } from 'electron';
import log from 'electron-log/main';
import { EntityTarget, ObjectLiteral } from 'typeorm';

import { AppDataSource } from '../../data-source';
import { IpcChannel } from '../../interfaces/IpcChannel';

type GetManyChannelType = {
  name: string;
  entity: EntityTarget<ObjectLiteral>;
};

export abstract class GetManyChannel implements IpcChannel {
  name: string;
  entity: EntityTarget<ObjectLiteral>;

  protected constructor({ name, entity }: GetManyChannelType) {
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
    const instances = await AppDataSource.manager.find(this.entity);
    event.sender.send(request.responseChannel, instanceToPlain(instances));
  }
}
