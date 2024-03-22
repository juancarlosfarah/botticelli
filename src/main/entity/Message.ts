import InputType from '@shared/enums/InputType';
import {
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
import { Exchange } from './Exchange';
import { KeyPressEvent } from './KeyPressEvent';

@Entity()
export class Message {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Exchange, (exchange) => exchange.messages, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  exchange: Relation<Exchange> | string;

  @Column({ default: '' })
  content: string = '';

  @Column({ type: 'text', default: InputType.Text })
  inputType: InputType = InputType.Text;

  @ManyToOne(() => Agent, (agent) => agent.messages, { eager: true })
  sender: Relation<Agent> | string;

  @OneToMany(() => KeyPressEvent, (keyPressEvent) => keyPressEvent.message)
  keyPressEvents: Relation<KeyPressEvent>[];

  @CreateDateColumn({ type: 'datetime' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'datetime' })
  updatedAt: Date;
}
