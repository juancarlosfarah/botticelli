import {
  AfterLoad,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Relation,
  TableInheritance,
  UpdateDateColumn,
} from 'typeorm';

// import AgentType from '../../shared/interfaces/AgentType';
import { Message } from './Message';

@Entity()
@TableInheritance({ column: { type: 'varchar', name: 'type' } })
export class SocialCue {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ default: '' })
  name: string = '';

  @Column({ default: '' })
  description: string = '';

  @Column({ default: '' })
  formulation: string = '';
  
  @Column({ default: '' })
  type: string = '';

  // @Column('simple-array', { nullable: true, default: null })
  // socialCues: string[] | null = null;  

  // @Column({ type: 'varchar' })
  // type: AgentType;

  @OneToMany(() => Message, (message) => message.sender)
  messages: Relation<Message>[];

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
