import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Relation,
  UpdateDateColumn,
} from 'typeorm';

import { Exchange } from './Exchange';
import { Message } from './Message';

@Entity()
export class Audio {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  transcription?: string;

  @Column()
  blobPath?: string;

  /*   @ManyToOne(() => Exchange, (exchange) => exchange.audios, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  exchange: Relation<Exchange> | string; */

  @ManyToOne(() => Message, (message) => message.audio)
  message?: Relation<Message>;

  /*   @CreateDateColumn({ type: 'datetime' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'datetime' })
  updatedAt: Date; */
}
