import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  Relation,
  UpdateDateColumn,
} from 'typeorm';

import { Agent } from './Agent';
import { Interaction } from './Interaction';
import { SimulationInteractionTemplate } from './SimulationInteractionTemplate';

@Entity()
export class Simulation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ default: '' })
  name: string = '';

  @Column({ default: '' })
  description: string = '';

  @OneToMany(() => Interaction, (interaction) => interaction.simulation, {
    eager: true,
  })
  interactions: Interaction[];

  @OneToMany(
    () => SimulationInteractionTemplate,
    (simulationInteractionTemplate) => simulationInteractionTemplate.simulation,
    { eager: true },
  )
  interactionTemplates: Relation<SimulationInteractionTemplate[]>;

  @ManyToMany(() => Agent)
  @JoinTable()
  participants: Agent[];

  @CreateDateColumn({ type: 'datetime' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'datetime' })
  updatedAt: Date;
}
