import Language from '@shared/enums/Language';
import Model from '@shared/enums/Model';
import ModelProvider from '@shared/enums/ModelProvider';
import {
  AfterLoad,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Setting {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text', default: ModelProvider.OpenAI })
  modelProvider: ModelProvider = ModelProvider.OpenAI;

  @Column({ type: 'text', default: Model.GPT_4O })
  model: Model = Model.GPT_4O;

  @Column({ default: '' })
  apiKey: string = '';

  @Column({ type: 'text', default: '' })
  email: string = '';

  @Column({ type: 'text', default: Language.EN })
  language: Language = Language.EN;

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
