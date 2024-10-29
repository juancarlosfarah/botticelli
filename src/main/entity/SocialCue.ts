import {
  AfterLoad,
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  PrimaryGeneratedColumn,
  Relation,
  JoinTable,
  ManyToOne,
  TableInheritance,
  UpdateDateColumn,
} from 'typeorm';

import { Agent } from './Agent';
import { SocialCueGroup } from './SocialCueGroup';

@Entity()
@TableInheritance({ column: { type: 'varchar', name: 'type' } })
export class SocialCue {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ default: '' })
  name: string;

  @Column({ default: '' })
  description: string;

  @Column({ default: '' })
  formulation: string;
  
  @Column({ default: '' })
  group: string;

  @CreateDateColumn({ type: 'datetime' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'datetime' })
  updatedAt: Date;

  @ManyToMany(() => Agent, (agent) => agent.socialCues)
  @JoinTable()
  socialCues: SocialCue[];

  @ManyToOne(() => SocialCueGroup, (socialCueGroup) => socialCueGroup.socialCues)
  socialCueGroup: SocialCueGroup;

  @AfterLoad()
  getCreatedAt(): void {
    this.createdAt = this.createdAt.toISOString();
  }

  @AfterLoad()
  getUpdatedAt(): void {
    this.updatedAt = this.updatedAt.toISOString();
  }
}
