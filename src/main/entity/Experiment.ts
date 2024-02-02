import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  Relation,
} from 'typeorm';

import { Agent } from './Agent';
import { ExperimentInteractionTemplate } from './ExperimentInteractionTemplate';
import { Interaction } from './Interaction';

@Entity()
export class Experiment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ default: '' })
  name: string = '';

  @Column({ default: '' })
  description: string = '';

  @OneToMany(() => Interaction, (interaction) => interaction.experiment, {
    eager: true,
  })
  interactions: Interaction[];

  @OneToMany(
    () => ExperimentInteractionTemplate,
    (experimentInteractionTemplate) => experimentInteractionTemplate.experiment,
    { eager: true },
  )
  interactionTemplates: Relation<ExperimentInteractionTemplate[]>;

  @ManyToMany(() => Agent)
  @JoinTable()
  participants: Agent[];
}
