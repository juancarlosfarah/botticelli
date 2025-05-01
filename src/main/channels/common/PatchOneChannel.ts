import { IpcRequest } from '@shared/interfaces/IpcRequest';
import { IpcMainEvent } from 'electron';
import { EntityTarget, ObjectLiteral } from 'typeorm';

import { IpcChannel } from '../../interfaces/IpcChannel';

type PatchOneChannelType = {
  name: string;
  entity: EntityTarget<ObjectLiteral>;
};

export abstract class PatchOneChannel implements IpcChannel {
  name: string;
  entity: EntityTarget<ObjectLiteral>;

  protected constructor({ name, entity }: PatchOneChannelType) {
    this.name = name;
    this.entity = entity;
  }

  getName(): string {
    return this.name;
  }

  abstract handle(event: IpcMainEvent, request: IpcRequest): Promise<void>;
}
