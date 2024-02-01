import {
  AfterLoad,
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Relation,
  UpdateDateColumn,
} from 'typeorm';

import { Agent } from './Agent';
import { ExchangeTemplate } from './ExchangeTemplate';
import { Interaction } from './Interaction';
import { Message } from './Message';
import { Trigger } from './Trigger';

@Entity()
export class Exchange {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ default: '' })
  name: string = '';

  @Column({ default: '' })
  description: string = '';

  @Column({ default: '' })
  instructions: string = '';

  @Column({ default: '' })
  cue: string = '';

  @Column({ default: 0 })
  order: number;

  @Column({ default: false })
  completed: boolean = false;

  @Column({ default: false })
  started: boolean = false;

  // note: array initialization is not allowed in relations
  @ManyToOne(() => Interaction, (interaction) => interaction.exchanges, {
    onDelete: 'CASCADE',
  })
  interaction: Relation<Interaction>;

  // note: array initialization is not allowed in relations
  @OneToMany(() => Message, (message) => message.exchange, { eager: true })
  messages: Relation<Message>[];

  @ManyToOne(() => Agent, { eager: true })
  assistant: Relation<Agent>;

  @ManyToOne(() => ExchangeTemplate)
  template: Relation<ExchangeTemplate>;

  @Column({ type: 'uuid', default: null })
  next: string;

  @ManyToMany(() => Trigger)
  @JoinTable()
  triggers: Trigger[];

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
