import {
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Relation,
  UpdateDateColumn,
} from 'typeorm';
import { Message } from './Message';

@Entity()
export class Conversation {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToMany(
    () => Message,
    (message) => message.conversation,
    // { eager: true }
  )
  messages: Relation<Message>[];

  @CreateDateColumn({ type: 'datetime' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'datetime' })
  updatedAt: Date;
}