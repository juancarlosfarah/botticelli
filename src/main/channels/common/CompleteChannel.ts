import { IpcRequest } from '@shared/interfaces/IpcRequest';
import { IpcMainEvent } from 'electron';
import { EntityTarget, ObjectLiteral } from 'typeorm';

import { IpcChannel } from '../../interfaces/IpcChannel';

type CompleteChannelType = {
  name: string;
  entity: EntityTarget<ObjectLiteral>;
};

export abstract class CompleteChannel<T> implements IpcChannel {
  name: string;
  entity: EntityTarget<ObjectLiteral>;

  protected constructor({ name, entity }: CompleteChannelType) {
    this.name = name;
    this.entity = entity;
  }

  getName(): string {
    return this.name;
  }

  abstract handle(event: IpcMainEvent, request: IpcRequest<T>): Promise<void>;
}
