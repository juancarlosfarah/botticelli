import {
  AfterLoad,
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  Relation,
  UpdateDateColumn,
} from 'typeorm';

import { Agent } from './Agent';
import { Trigger } from './Trigger';

@Entity()
export class ExchangeTemplate {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ default: '' })
  name: string = '';

  @Column({ default: '' })
  description: string = '';

  @Column({ default: '' })
  instructions: string = '';

  @Column({ default: '' })
  participantInstructionsOnComplete: string = '';

  @Column({ default: '' })
  cue: string = '';

  @Column({ default: 0 })
  softLimit: number = 0;

  @Column({ default: 0 })
  hardLimit: number = 0;

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
