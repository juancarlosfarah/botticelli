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
  blob: Blob;

  @Column()
  transcription?: string;

  @ManyToOne(() => Exchange, (exchange) => exchange.audios, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  exchange: Relation<Exchange> | string;

  @ManyToOne(() => Message, (message) => message.audios)
  message: Message;

  @CreateDateColumn({ type: 'datetime' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'datetime' })
  updatedAt: Date;
}
