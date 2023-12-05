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
import { ExchangeTemplate } from './ExchangeTemplate';

@Entity()
export class InteractionTemplate {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ default: '' })
  name: string = '';

  @Column({ default: '' })
  description: string = '';

  @Column({ default: '' })
  instructions: string = '';

  @ManyToOne(() => Agent, { eager: true })
  participant: Relation<Agent>;

  // @Column({ type: 'array' })
  // exchangeOrder: string[];

  @Column({ type: 'uuid', default: null })
  currentExchange: string;

  // note: array initialization is not allowed in relations
  @ManyToMany(() => ExchangeTemplate)
  @JoinTable()
  exchangeTemplates: ExchangeTemplate[];

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
