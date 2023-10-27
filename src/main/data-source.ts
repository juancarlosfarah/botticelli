import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { User } from './entity/User';
import { Conversation } from './entity/Conversation';
import { Message } from './entity/Message';
import { Agent } from './entity/Agent';

export const AppDataSource = new DataSource({
  type: 'sqlite',
  database: 'database.sqlite',
  synchronize: true,
  logging: false,
  entities: [User, Conversation, Message, Agent],
  migrations: [],
  subscribers: [],
});
