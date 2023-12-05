import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Agent } from './Agent';
import { Interaction } from './Interaction';

@Entity()
export class Experiment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ default: '' })
  name: string = '';

  @Column({ default: '' })
  description: string = '';

  // note: array initialization is not allowed in relations
  @ManyToMany(() => Interaction)
  @JoinTable()
  interactions: Interaction[];

  // note: array initialization is not allowed in relations
  @ManyToMany(() => Agent)
  @JoinTable()
  participants: Agent[];
}
