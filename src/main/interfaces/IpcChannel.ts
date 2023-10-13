import { IpcMainEvent } from 'electron';
import { IpcRequest } from '../../shared/interfaces/IpcRequest';

export interface IpcChannel {
  getName(): string;

  handle(event: IpcMainEvent, request: IpcRequest): void;
}
