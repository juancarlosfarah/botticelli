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

import { Experiment } from './Experiment';
import { InteractionTemplate } from './InteractionTemplate';

@Entity()
export class ExperimentInteractionTemplate {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Experiment, { onDelete: 'CASCADE' })
  experiment: Relation<Experiment>;

  @ManyToOne(() => InteractionTemplate)
  interactionTemplate: Relation<InteractionTemplate>;

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
