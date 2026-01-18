import { AppDataSource } from '../data-source'
import { Appointment, AppointmentStatus } from '../entities/Appointment'
import { User } from '../entities/User'

interface IRequest {
  clientId: number
  technicianId: number
  title: string
  description: string
  category: string
  scheduledDate: Date
  address?: string
  city?: string
  phone?: string
  notes?: string
}

export class CreateAppointmentService {
  async execute({
    clientId,
    technicianId,
    title,
    description,
    category,
    scheduledDate,
    address,
    city,
    phone,
    notes
  }: IRequest) {
    const appointmentsRepository = AppDataSource.getRepository(Appointment)
    const usersRepository = AppDataSource.getRepository(User)

    const client = await usersRepository.findOne({ where: { id: clientId } })
    const technician = await usersRepository.findOne({ where: { id: technicianId } })

    if (!client || !technician) {
      throw new Error('Cliente ou técnico não encontrado')
    }

    const appointment = appointmentsRepository.create({
      client,
      technician,
      title,
      description,
      category,
      scheduledDate,
      address,
      city,
      phone,
      notes,
      status: AppointmentStatus.PENDENTE
    })

    await appointmentsRepository.save(appointment)

    return appointment
  }
}
