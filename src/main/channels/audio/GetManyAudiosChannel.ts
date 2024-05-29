import { GET_AUDIOS_CHANNEL } from '@shared/channels';
import { instanceToPlain } from 'class-transformer';
import { IpcMainEvent } from 'electron';
import log from 'electron-log/main';

import { GetManyAudiosParams } from '../../../shared/interfaces/Audio';
import { IpcRequest } from '../../../shared/interfaces/IpcRequest';
import { AppDataSource } from '../../data-source';
import { Audio } from '../../entity/Audio';
import { IpcChannel } from '../../interfaces/IpcChannel';

export class GetManyAudiosChannel implements IpcChannel {
  getName(): string {
    return GET_AUDIOS_CHANNEL;
  }

  async handle(
    event: IpcMainEvent,
    request: IpcRequest<GetManyAudiosParams>,
  ): Promise<void> {
    // debug
    log.debug(`handling ${this.getName()}...`);

    if (!request.responseChannel) {
      request.responseChannel = `${this.getName()}:response`;
    }

    // todo: return error
    if (!request.params) {
      event.sender.send(request.responseChannel, {});
      return;
    }

    const { messageId } = request.params;

    // debug
    log.debug(`getting audios for message:`, messageId);

    const audioRepository = AppDataSource.getRepository(Audio);
    const audios = await audioRepository.findBy({
      message: { id: messageId },
    });

    // debug
    log.debug(`got ${audios?.length} audios`);

    event.sender.send(request.responseChannel, instanceToPlain(audios));
  }
}
