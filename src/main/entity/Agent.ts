import {
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  AfterLoad,
  Relation,
  Entity,
  TableInheritance,
} from 'typeorm';
import { Message } from './Message';

@Entity()
@TableInheritance({ column: { type: "varchar", name: "type" } })
export class Agent {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: '' })
  name: string = '';

  @Column({ default: '' })
  description: string = '';

  @Column()
  type: string;

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
