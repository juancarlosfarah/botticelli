import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Relation,
} from 'typeorm';

import { Agent } from './Agent';
import { Exchange } from './Exchange';
import { ExchangeTemplate } from './ExchangeTemplate';

@Entity()
export class Interaction {
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

  // note: array initialization is not allowed in relations
  @OneToMany(() => Exchange, (exchange) => exchange.interaction, {
    eager: true,
  })
  exchanges: Relation<Exchange[]>;

  // @Column({ type: 'array' })
  // exchangeOrder: string[];

  @Column({ type: 'uuid', default: null })
  currentExchange: string;

  // note: array initialization is not allowed in relations
  @ManyToMany(() => ExchangeTemplate)
  @JoinTable()
  exchangeTemplates: ExchangeTemplate[];
}
