import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn
} from 'typeorm'
import { User } from './User'

@Entity('reviews')
export class Review {
  @PrimaryGeneratedColumn()
  id!: number

  @Column()
  stars!: number

  @Column('text')
  comment!: string

  @ManyToOne(() => User, (user) => user.reviewsGiven)
  @JoinColumn({ name: 'client_id' })
  client!: User

  @ManyToOne(() => User, (user) => user.reviewsReceived)
  @JoinColumn({ name: 'technician_id' })
  technician!: User

  @CreateDateColumn()
  created_at!: Date
}