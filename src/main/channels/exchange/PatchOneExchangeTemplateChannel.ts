import { AppDataSource } from '@main/data-source';
import { ExchangeTemplate } from '@main/entity/ExchangeTemplate';
import { PATCH_ONE_EXCHANGE_TEMPLATE_CHANNEL } from '@shared/channels';
import { IpcRequest } from '@shared/interfaces/IpcRequest';
import { instanceToPlain } from 'class-transformer';
import { IpcMainEvent } from 'electron';
import log from 'electron-log/main';

import { PatchOneChannel } from '../common/PatchOneChannel';

export class PatchOneExchangeTemplateChannel extends PatchOneChannel {
  constructor() {
    super({
      name: PATCH_ONE_EXCHANGE_TEMPLATE_CHANNEL,
      entity: ExchangeTemplate,
    });
  }

  async handle(event: IpcMainEvent, request: IpcRequest): Promise<void> {
    if (!request.responseChannel) {
      request.responseChannel = `${this.name}:response`;
    }

    if (!request.params) {
      event.sender.send(request.responseChannel, {
        error: 'Missing parameters',
      });
      return;
    }

    const { id, name, description } = request.params;

    // update  template
    await AppDataSource.manager.update(ExchangeTemplate, id, {
      name,
      description,
    });

    // refetch it after updating
    const repository = AppDataSource.getRepository(ExchangeTemplate);
    const exchangeTemplate = await repository.findOneBy({ id });

    if (!exchangeTemplate) {
      log.error(
        `[PatchOneExchangeTemplateChannel] No exchange template found for id ${id}`,
      );
      event.sender.send(request.responseChannel, {
        error: 'Exchange template not found',
      });
      return;
    }

    event.sender.send(
      request.responseChannel,
      instanceToPlain(exchangeTemplate),
    );
  }
}
