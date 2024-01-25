export interface IpcRequest<T> {
  responseChannel?: string;

  params?: T;
}
