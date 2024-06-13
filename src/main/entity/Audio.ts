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

  binaryData?: Buffer;

  @ManyToOne(() => Exchange, (exchange) => exchange.audios, {
    onDelete: 'CASCADE',
    nullable: true,
  })
  exchange: Relation<Exchange> | string;

  @ManyToOne(() => Message, (message) => message.audios)
  message?: Relation<Message> | string;

  @CreateDateColumn({ type: 'datetime' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'datetime' })
  updatedAt: Date;
}
