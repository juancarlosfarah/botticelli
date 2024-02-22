import { ChildEntity, Column, ManyToOne, Relation } from 'typeorm';

import { Event } from './Event';
import { Message } from './Message';

@ChildEntity()
export class KeyPressEvent extends Event {
  @Column({ default: '' })
  key: string = '';

  // note: array initialization is not allowed in relations
  @ManyToOne(() => Message, (message) => message.keyPressEvents, {
    onDelete: 'CASCADE',
  })
  message: Relation<Message>;
}
