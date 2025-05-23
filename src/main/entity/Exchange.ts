import {
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

import InputType from '../../shared/enums/InputType';
import { Agent } from './Agent';
import { Audio } from './Audio';
import { ExchangeTemplate } from './ExchangeTemplate';
import { Interaction } from './Interaction';
import { Message } from './Message';
import { Trigger } from './Trigger';

@Entity()
export class Exchange {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text', default: '' })
  email: string;

  @Column({ default: '' })
  name: string = '';

  @Column({ default: '' })
  description: string = '';

  @Column({ default: '' })
  instructions: string = '';

  @Column({ default: '' })
  cue: string = '';

  @Column({ type: 'text', default: InputType.Text })
  inputType: InputType = InputType.Text;

  @Column({ default: 0 })
  softLimit: number = 0;

  @Column({ default: 0 })
  hardLimit: number = 0;

  @Column({ default: 0, nullable: true })
  order: number = 0;

  @Column({ default: false })
  completed: boolean = false;

  @Column({ default: false })
  started: boolean = false;

  @Column({ default: false })
  dismissed: boolean = false;

  // note: array initialization is not allowed in relations
  @ManyToOne(() => Interaction, (interaction) => interaction.exchanges, {
    onDelete: 'CASCADE',
  })
  interaction: Relation<Interaction>;

  @OneToMany(() => Message, (message) => message.exchange, { eager: true })
  messages: Relation<Message[]>;

  @OneToMany(() => Audio, (audio) => audio.exchange, { eager: true })
  audios: Relation<Audio[]>;

  @ManyToOne(() => Agent, { eager: true })
  assistant: Relation<Agent>;

  @ManyToOne(() => ExchangeTemplate)
  template: Relation<ExchangeTemplate>;

  @Column({ type: 'uuid', default: null })
  next: string;

  @ManyToMany(() => Trigger)
  @JoinTable()
  triggers: Trigger[];

  @Column({ default: '' })
  participantInstructionsOnComplete: string = '';

  @Column({ default: '' })
  participantInstructionsOnHardComplete: string = '';

  @Column({ default: null, type: 'datetime' })
  startedAt: Date;

  @Column({ default: null, type: 'datetime' })
  completedAt: Date;

  @CreateDateColumn({ type: 'datetime' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'datetime' })
  updatedAt: Date;

  @UpdateDateColumn({ type: 'datetime' })
  dismissedAt: Date;
}
