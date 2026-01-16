import 'reflect-metadata'
import { DataSource } from 'typeorm'
import { User } from './entities/User'
import { Review } from './entities/Review'

export const AppDataSource = new DataSource({
  type: 'sqlite',
  database: 'database.sqlite',
  synchronize: true,
  logging: false,
  entities: [User, Review],
})
