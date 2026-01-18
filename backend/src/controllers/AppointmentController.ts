import { Request, Response } from 'express'
import { CreateAppointmentService } from '../services/CreateAppointmentService'
import { ListAppointmentsService } from '../services/ListAppointmentsService'
import { GetAppointmentByIdService } from '../services/GetAppointmentByIdService'
import { UpdateAppointmentStatusService } from '../services/UpdateAppointmentStatusService'
import { DeleteAppointmentService } from '../services/DeleteAppointmentService'
import { AppointmentStatus } from '../entities/Appointment'

export class AppointmentController {
  async create(req: Request, res: Response) {
    const { clientId, technicianId, title, description, category, scheduledDate, address, city, phone, notes } = req.body

    if (!clientId || !technicianId || !title || !description || !category || !scheduledDate) {
      return res.status(400).json({ message: 'Campos obrigatórios faltando' })
    }

    try {
      const service = new CreateAppointmentService()
      const appointment = await service.execute({
        clientId,
        technicianId,
        title,
        description,
        category,
        scheduledDate: new Date(scheduledDate),
        address,
        city,
        phone,
        notes
      })

      return res.status(201).json(appointment)
    } catch (error: any) {
      return res.status(400).json({ message: error.message })
    }
  }

  async list(req: Request, res: Response) {
    const service = new ListAppointmentsService()
    const appointments = await service.execute()

    return res.json(appointments)
  }

  async show(req: Request, res: Response) {
    const { id } = req.params

    try {
      const service = new GetAppointmentByIdService()
      const appointment = await service.execute(id)

      return res.json(appointment)
    } catch (error: any) {
      return res.status(404).json({ message: error.message })
    }
  }

  async updateStatus(req: Request, res: Response) {
    const { id } = req.params
    const { status } = req.body

    if (!status || !Object.values(AppointmentStatus).includes(status)) {
      return res.status(400).json({ message: 'Status inválido' })
    }

    try {
      const service = new UpdateAppointmentStatusService()
      const appointment = await service.execute({ id, status })

      return res.json(appointment)
    } catch (error: any) {
      return res.status(400).json({ message: error.message })
    }
  }

  async delete(req: Request, res: Response) {
    const { id } = req.params

    try {
      const service = new DeleteAppointmentService()
      const result = await service.execute({ id })

      return res.json(result)
    } catch (error: any) {
      return res.status(400).json({ message: error.message })
    }
  }
}
