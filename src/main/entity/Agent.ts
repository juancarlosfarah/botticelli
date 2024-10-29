import {
  AfterLoad,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  ManyToMany,
  PrimaryGeneratedColumn,
  Relation,
  JoinTable,
  TableInheritance,
  UpdateDateColumn,
} from 'typeorm';

import { SocialCue } from './SocialCue';

import AgentType from '../../shared/interfaces/AgentType';
import { Message } from './Message';

@Entity()
@TableInheritance({ column: { type: 'varchar', name: 'type' } })
export class Agent {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ default: '' })
  name: string = '';

  @Column({ default: '' })
  description: string = '';

  @Column({ default: '' })
  avatarUrl: string = '';

  @OneToMany(() => Message, (message) => message.sender)
  messages: Message[];
  
  @ManyToMany(() => SocialCue, { eager: true })
  @JoinTable()
  socialCues: SocialCue[];

  @Column({ type: 'varchar' })
  type: AgentType;

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
