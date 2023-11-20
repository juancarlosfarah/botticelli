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
import { Message } from './Message';

@Entity()
export class Conversation {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: '' })
  description: string = '';

  @Column({ default: '' })
  instructions: string = '';

  // note: array initialization is not allowed in relations
  @OneToMany(() => Message, (message) => message.conversation, { eager: true })
  messages: Relation<Message>[];

  @ManyToOne(() => Agent, { eager: true })
  lead: Relation<Agent>;

  participants: Map<number, Agent> = new Map<number, Agent>();

  @AfterLoad()
  getParticipants(): void {
    if (this.messages?.length) {
      this.messages.forEach((message) => {
        if (!this.participants.has(message.sender.id)) {
          this.participants.set(message.sender.id, message.sender);
        }
      });
    }
  }

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
