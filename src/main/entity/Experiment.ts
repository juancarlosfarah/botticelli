import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Agent } from './Agent';
import { Interaction } from './Interaction';
import { InteractionTemplate } from './InteractionTemplate';

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
  // @ts-ignore: array initialization is not allowed in relations
  interactions: Interaction[];

  @ManyToMany(() => InteractionTemplate)
  @JoinTable()
  // @ts-ignore: array initialization is not allowed in relations
  interactionTemplates: InteractionTemplate[];

  @ManyToMany(() => Agent)
  @JoinTable()
  // @ts-ignore: array initialization is not allowed in relations
  participants: Agent[];
}
