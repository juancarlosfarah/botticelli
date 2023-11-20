import { instanceToPlain } from 'class-transformer';
import { IpcMainEvent } from 'electron';
import log from 'electron-log/main';
import { EntityTarget, ObjectLiteral } from 'typeorm';

import { IpcRequest } from '../../../shared/interfaces/IpcRequest';
import { AppDataSource } from '../../data-source';
import { IpcChannel } from '../../interfaces/IpcChannel';

type DeleteOneChannelType = {
  name: string;
  entity: EntityTarget<ObjectLiteral>;
};

export abstract class DeleteOneChannel implements IpcChannel {
  name: string;
  entity: EntityTarget<ObjectLiteral>;

  protected constructor({ name, entity }: DeleteOneChannelType) {
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
    const id = request.params?.id;

    // debugging
    log.debug(`using id:`, id);

    const instance = await AppDataSource.manager.delete(this.entity, { id });
    event.sender.send(request.responseChannel, instanceToPlain(instance));
  }
}
