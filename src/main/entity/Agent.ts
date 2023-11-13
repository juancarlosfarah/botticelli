import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  JoinTable,
  AfterLoad,
} from 'typeorm';
import { Message } from './Message';

@Entity()
export class Agent {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: '' })
  name: string = '';

  @Column()
  type: string;

  @Column({ default: '' })
  description: string = '';

  @OneToMany(() => Message, (message) => message.sender)
  // todo: do we need this?
  @JoinTable()
  messages: Message[];

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
