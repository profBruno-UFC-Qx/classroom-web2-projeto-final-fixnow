import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn
} from 'typeorm'
import { User } from './User'

export enum AppointmentStatus {
  PENDENTE = 'PENDENTE',
  CONFIRMADO = 'CONFIRMADO',
  CONCLUIDO = 'CONCLUIDO',
  CANCELADO = 'CANCELADO'
}

@Entity('appointments')
export class Appointment {
  @PrimaryGeneratedColumn()
  id!: number

  @ManyToOne(() => User, (user) => user.appointmentsAsClient, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'client_id' })
  client!: User

  @ManyToOne(() => User, (user) => user.appointmentsAsTechnician, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'technician_id' })
  technician!: User

  @Column()
  title!: string

  @Column('text')
  description!: string

  @Column()
  category!: string

  @Column()
  scheduledDate!: Date

  @Column({
    type: 'text',
    default: AppointmentStatus.PENDENTE
  })
  status!: AppointmentStatus

  @Column({ nullable: true })
  address?: string

  @Column({ nullable: true })
  city?: string

  @Column({ nullable: true })
  phone?: string

  @Column({ nullable: true, type: 'text' })
  notes?: string

  @CreateDateColumn()
  created_at!: Date

  @UpdateDateColumn()
  updated_at!: Date
}
