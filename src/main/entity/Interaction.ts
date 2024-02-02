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
import { Exchange } from './Exchange';
import { Experiment } from './Experiment';
import { InteractionTemplate } from './InteractionTemplate';

@Entity()
export class Interaction {
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

  @Column({ default: false })
  started: boolean = false;

  @Column({ default: false })
  completed: boolean = false;

  @ManyToOne(() => Agent, { eager: true })
  participant: Relation<Agent>;

  @OneToMany(() => Exchange, (exchange) => exchange.interaction, {
    eager: true,
  })
  exchanges: Relation<Exchange[]>;

  @ManyToOne(() => Experiment, (experiment) => experiment.interactions, {
    onDelete: 'CASCADE',
  })
  experiment: Relation<Experiment>;

  @Column({ default: 0 })
  order: number = 0;

  @Column({ type: 'uuid', default: null })
  currentExchange: string;

  @ManyToOne(() => InteractionTemplate)
  template: Relation<InteractionTemplate>;

  @Column({ default: null, type: 'datetime' })
  startedAt: Date;

  @Column({ default: null, type: 'datetime' })
  completedAt: Date;

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
