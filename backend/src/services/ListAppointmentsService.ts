import { AppDataSource } from '../data-source'
import { Appointment } from '../entities/Appointment'

export class ListAppointmentsService {
  async execute() {
    const appointmentsRepository = AppDataSource.getRepository(Appointment)
    
    const appointments = await appointmentsRepository.find({
      relations: ['client', 'technician'],
      order: {
        scheduledDate: 'DESC'
      }
    })

    return appointments
  }
}
