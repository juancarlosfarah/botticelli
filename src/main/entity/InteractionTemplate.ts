import {
  AfterLoad,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Relation,
  UpdateDateColumn,
} from 'typeorm';

import { Agent } from './Agent';
import { InteractionTemplateExchangeTemplate } from './InteractionTemplateExchangeTemplate';

@Entity()
export class InteractionTemplate {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ default: '' })
  name: string = '';

  @Column({ default: '' })
  description: string = '';

  @Column({ default: '' })
  modelInstructions: string = '';

  @Column({ default: '' })
  participantInstructions: string = '';

  @Column({ default: '' })
  participantInstructionsOnComplete: string = '';

  @ManyToOne(() => Agent, { eager: true })
  participant: Relation<Agent>;

  @OneToMany(
    () => InteractionTemplateExchangeTemplate,
    (interactionTemplateExchangeTemplate) =>
      interactionTemplateExchangeTemplate.interactionTemplate,
    { eager: true },
  )
  exchangeTemplates: Relation<InteractionTemplateExchangeTemplate[]>;

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
