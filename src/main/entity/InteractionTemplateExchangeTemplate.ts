import {
  AfterLoad,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Relation,
  UpdateDateColumn,
} from 'typeorm';

import { ExchangeTemplate } from './ExchangeTemplate';
import { InteractionTemplate } from './InteractionTemplate';

@Entity()
export class InteractionTemplateExchangeTemplate {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // note: initialization is not allowed in relations
  @ManyToOne(() => InteractionTemplate, { onDelete: 'CASCADE' })
  interactionTemplate: Relation<InteractionTemplate>;

  // note: initialization is not allowed in relations
  @ManyToOne(() => ExchangeTemplate)
  exchangeTemplate: Relation<ExchangeTemplate>;

  @Column({ default: 0 })
  order: number = 0;

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
