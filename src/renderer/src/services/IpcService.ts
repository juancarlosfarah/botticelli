import { IpcRequest } from '../../../shared/interfaces/IpcRequest';

export class IpcService {
  public static send<ResponseType, RequestType = ResponseType>(
    channel: string,
    request: IpcRequest<RequestType> = {},
  ): Promise<ResponseType> {
    // if the ipcRenderer is not available try to initialize it
    const ipcRenderer = window.electron.ipcRenderer;
    if (!ipcRenderer) {
      throw new Error(`Unable to require renderer process`);
    }

    // if there's no responseChannel let's auto-generate it
    if (!request.responseChannel) {
      request.responseChannel = `${channel}:response:${new Date().getTime()}`;
    }

    // returns a promise which will be resolved when the response has arrived
    return new Promise((resolve) => {
      const responseChannel = request.responseChannel;

      ipcRenderer.once(responseChannel, (_, response) => {
        console.log(`Received response on ${responseChannel}`, response);
        resolve(response);
      });

      ipcRenderer.send(channel, request);
    });
  }
}
