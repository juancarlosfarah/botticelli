import { IpcMainEvent } from 'electron';
import { EntityTarget, ObjectLiteral } from 'typeorm';

import { IpcRequest } from '../../../shared/interfaces/IpcRequest';
import { IpcChannel } from '../../interfaces/IpcChannel';

type PostOneChannelType = {
  name: string;
  entity: EntityTarget<ObjectLiteral>;
};

export abstract class PostOneChannel implements IpcChannel {
  name: string;
  entity: EntityTarget<ObjectLiteral>;

  protected constructor({ name, entity }: PostOneChannelType) {
    this.name = name;
    this.entity = entity;
  }

  getName(): string {
    return this.name;
  }

  abstract handle(event: IpcMainEvent, request: IpcRequest): Promise<void>;
}
