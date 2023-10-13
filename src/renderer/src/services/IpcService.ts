import { IpcRequest } from '../../../shared/interfaces/IpcRequest';

export class IpcService {
  public static send<T>(channel: string, request: IpcRequest = {}): Promise<T> {
    // if the ipcRenderer is not available try to initialize it
    const ipcRenderer = window.electron.ipcRenderer;
    if (!ipcRenderer) {
      throw new Error(`Unable to require renderer process`);
    }

    // if there's no responseChannel let's auto-generate it
    if (!request.responseChannel) {
      request.responseChannel = `${channel}:response:${new Date().getTime()}`;
    }
    ipcRenderer.send(channel, request);

    // returns a promise which will be resolved when the response has arrived
    return new Promise((resolve) => {
      ipcRenderer.once(request.responseChannel, (event, response) => resolve(response));
    });
  }
}
