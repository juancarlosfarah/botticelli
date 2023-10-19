import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { User } from './entity/User';
import { Conversation } from './entity/Conversation';

export const AppDataSource = new DataSource({
  type: 'sqlite',
  database: 'database.sqlite',
  synchronize: true,
  logging: false,
  entities: [User, Conversation],
  migrations: [],
  subscribers: [],
});
