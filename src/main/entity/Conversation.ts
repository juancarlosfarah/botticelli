import log from 'electron-log/main';
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
import { Message } from './Message';
import { Trigger } from './Trigger';

@Entity()
export class Conversation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ default: '' })
  description: string = '';

  @Column({ default: '' })
  instructions: string = '';

  @Column({ default: false })
  completed: boolean = false;

  // note: array initialization is not allowed in relations
  @OneToMany(() => Message, (message) => message.conversation, { eager: true })
  messages: Relation<Message>[];

  @ManyToOne(() => Agent, { eager: true })
  participant: Relation<Agent>;

  @ManyToOne(() => Agent, { eager: true })
  assistant: Relation<Agent>;

  @ManyToMany(() => Trigger)
  @JoinTable()
  triggers: Trigger[];

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
