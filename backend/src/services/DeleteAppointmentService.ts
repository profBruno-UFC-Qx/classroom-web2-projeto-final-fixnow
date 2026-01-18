import { AppDataSource } from '../data-source'
import { Appointment } from '../entities/Appointment'

interface IRequest {
  id: string
}

export class DeleteAppointmentService {
  async execute({ id }: IRequest) {
    const appointmentsRepository = AppDataSource.getRepository(Appointment)

    const appointment = await appointmentsRepository.findOne({
      where: { id: Number(id) }
    })

    if (!appointment) {
      throw new Error('Agendamento não encontrado')
    }

    await appointmentsRepository.remove(appointment)

    return { message: 'Agendamento cancelado com sucesso' }
  }
}
