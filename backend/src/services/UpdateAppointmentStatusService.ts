import { AppDataSource } from '../data-source'
import { Appointment, AppointmentStatus } from '../entities/Appointment'

interface IRequest {
  id: string
  status: AppointmentStatus
}

export class UpdateAppointmentStatusService {
  async execute({ id, status }: IRequest) {
    const appointmentsRepository = AppDataSource.getRepository(Appointment)

    const appointment = await appointmentsRepository.findOne({
      where: { id: Number(id) }
    })

    if (!appointment) {
      throw new Error('Agendamento não encontrado')
    }

    appointment.status = status

    await appointmentsRepository.save(appointment)

    return appointment
  }
}
