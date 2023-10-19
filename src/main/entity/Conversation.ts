import { Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Conversation {
  @PrimaryGeneratedColumn()
  id: number;
}
