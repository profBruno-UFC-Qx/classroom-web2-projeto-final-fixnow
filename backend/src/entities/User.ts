import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany
} from 'typeorm'
import { Review } from './Review'

export enum UserRole {
  ADMIN = 'ADMIN',
  CLIENTE = 'CLIENTE',
  TECNICO = 'TECNICO'
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id!: number

  @Column()
  name!: string

  @Column({ unique: true })
  email!: string

  @Column()
  password!: string

  @Column({
    type: 'text',
    default: UserRole.CLIENTE
  })
  role!: UserRole

  @Column({
    type: 'text',
    nullable: true
  })
  profession?: string

  @Column({
    type: 'text',
    nullable: true
  })
  profileImage?: string

  @Column({
    type: 'text',
    nullable: true
  })
  phone?: string

  @CreateDateColumn()
  created_at!: Date

  @UpdateDateColumn()
  updated_at!: Date

  @OneToMany(() => Review, (review) => review.client, { cascade: true })
  reviewsGiven!: Review[]

  @OneToMany(() => Review, (review) => review.technician, { cascade: true })
  reviewsReceived!: Review[]
}
