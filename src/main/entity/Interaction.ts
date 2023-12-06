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
  instructions: string = '';

  @Column({ default: false })
  completed: boolean = false;

  @ManyToOne(() => Agent, { eager: true })
  // @ts-ignore: array initialization is not allowed in relations
  participant: Relation<Agent>;

  @OneToMany(() => Exchange, (exchange) => exchange.interaction, {
    eager: true,
  })
  // @ts-ignore: array initialization is not allowed in relations
  exchanges: Relation<Exchange[]>;

  @ManyToOne(() => Experiment, (experiment) => experiment.interactions, {
    onDelete: 'CASCADE',
  })
  // @ts-ignore: array initialization is not allowed in relations
  experiment: Relation<Experiment>;

  // @Column({ type: 'array' })
  // exchangeOrder: string[];

  @Column({ type: 'uuid', default: null })
  currentExchange: string;

  @ManyToOne(() => InteractionTemplate)
  // @ts-ignore: array initialization is not allowed in relations
  template: Relation<InteractionTemplate>;

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
