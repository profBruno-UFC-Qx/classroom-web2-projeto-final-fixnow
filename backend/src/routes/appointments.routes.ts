import { Router } from 'express'
import { AppointmentController } from '../controllers/AppointmentController'
import { authMiddleware } from '../middlewares/authMiddleware'

const appointmentsRoutes = Router()
const appointmentController = new AppointmentController()

/**
 * @swagger
 * /appointments:
 *   post:
 *     summary: Cria um novo agendamento (requer autenticação)
 *     tags: [Appointments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - clientId
 *               - technicianId
 *               - title
 *               - description
 *               - category
 *               - scheduledDate
 *             properties:
 *               clientId:
 *                 type: integer
 *               technicianId:
 *                 type: integer
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               category:
 *                 type: string
 *               scheduledDate:
 *                 type: string
 *                 format: date-time
 *               address:
 *                 type: string
 *               city:
 *                 type: string
 *               phone:
 *                 type: string
 *               notes:
 *                 type: string
 *     responses:
 *       201:
 *         description: Agendamento criado
 */
appointmentsRoutes.post('/', authMiddleware, appointmentController.create)

/**
 * @swagger
 * /appointments:
 *   get:
 *     summary: Lista todos os agendamentos
 *     tags: [Appointments]
 *     responses:
 *       200:
 *         description: Lista de agendamentos
 */
appointmentsRoutes.get('/', appointmentController.list)

/**
 * @swagger
 * /appointments/{id}:
 *   get:
 *     summary: Obtém um agendamento pelo ID
 *     tags: [Appointments]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Dados do agendamento
 */
appointmentsRoutes.get('/:id', appointmentController.show)

/**
 * @swagger
 * /appointments/{id}/status:
 *   put:
 *     summary: Atualiza o status de um agendamento (requer autenticação)
 *     tags: [Appointments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [PENDENTE, CONFIRMADO, CONCLUIDO, CANCELADO]
 *     responses:
 *       200:
 *         description: Status atualizado
 */
appointmentsRoutes.put('/:id/status', authMiddleware, appointmentController.updateStatus)

/**
 * @swagger
 * /appointments/{id}:
 *   delete:
 *     summary: Cancela um agendamento (requer autenticação)
 *     tags: [Appointments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Agendamento cancelado
 */
appointmentsRoutes.delete('/:id', authMiddleware, appointmentController.delete)

export { appointmentsRoutes }
