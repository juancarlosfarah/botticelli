import { IpcRequest } from '@shared/interfaces/IpcRequest';
import { IpcMainEvent } from 'electron';
import { EntityTarget, ObjectLiteral } from 'typeorm';

import { IpcChannel } from '../../interfaces/IpcChannel';

type SetChannelType = {
  name: string;
  entity: EntityTarget<ObjectLiteral>;
};

export abstract class SetChannel<T> implements IpcChannel {
  name: string;
  entity: EntityTarget<ObjectLiteral>;

  protected constructor({ name, entity }: SetChannelType) {
    this.name = name;
    this.entity = entity;
  }

  getName(): string {
    return this.name;
  }

  abstract handle(event: IpcMainEvent, request: IpcRequest<T>): Promise<void>;
}
