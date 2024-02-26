import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Relation,
  UpdateDateColumn,
} from 'typeorm';

import { InteractionTemplate } from './InteractionTemplate';
import { Simulation } from './Simulation';

@Entity()
export class SimulationInteractionTemplate {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Simulation, { onDelete: 'CASCADE' })
  simulation: Relation<Simulation>;

  @ManyToOne(() => InteractionTemplate)
  interactionTemplate: Relation<InteractionTemplate>;

  @Column({ default: 0 })
  order: number = 0;

  @CreateDateColumn({ type: 'datetime' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'datetime' })
  updatedAt: Date;
}
