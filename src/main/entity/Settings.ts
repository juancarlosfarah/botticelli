import Model from '@shared/enums/Model';
import ModelProvider from '@shared/enums/ModelProvider';
//import { Model } from 'openai/resources';
import {
  AfterLoad,
  Column,
  CreateDateColumn,
  Entity,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Settings {
  @Column({ type: 'text', default: ModelProvider.OpenAI })
  modelProvider: ModelProvider = ModelProvider.OpenAI;

  @Column({ type: 'text', default: Model.GPT_4O })
  model: Model = Model.GPT_4O;

  @Column({ default: '' })
  modelKey: string = '';

  @CreateDateColumn({ type: 'datetime' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'datetime' })
  updatedAt: Date;

  @AfterLoad()
  getCreatedAt(): void {
    this.createdAt = this.createdAt.toISOString();
  }

  @AfterLoad()
  getUpdatedAt(): void {
    this.updatedAt = this.updatedAt.toISOString();
  }
}
