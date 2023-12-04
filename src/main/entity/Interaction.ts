import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Relation,
} from 'typeorm';

import { Conversation } from './Conversation';

@Entity()
export class Interaction {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: '' })
  description: string = '';

  @Column({ default: '' })
  instructions: string = '';

  // note: array initialization is not allowed in relations
  @OneToMany(() => Conversation, (conversation) => conversation.interaction, {
    eager: true,
  })
  conversations: Relation<Conversation>[];
}
