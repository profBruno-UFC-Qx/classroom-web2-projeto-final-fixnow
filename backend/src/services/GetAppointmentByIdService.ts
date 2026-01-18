import { AppDataSource } from '../data-source'
import { Appointment } from '../entities/Appointment'

export class GetAppointmentByIdService {
  async execute(id: string) {
    const appointmentsRepository = AppDataSource.getRepository(Appointment)

    const appointment = await appointmentsRepository.findOne({
      where: { id: Number(id) },
      relations: ['client', 'technician']
    })

    if (!appointment) {
      throw new Error('Agendamento não encontrado')
    }

    return appointment
  }
}
