import { Router } from 'express'
import { usersRoutes } from './users.routes'
import { categoriesRoutes } from './categories.routes'
import { appointmentsRoutes } from './appointments.routes'
import { AuthController } from '../controllers/AuthController'
import { ReviewController } from '../controllers/ReviewController'
import { authMiddleware } from '../middlewares/authMiddleware'
import swaggerUi from 'swagger-ui-express'
import { swaggerSpec } from '../swagger'

export const routes = Router()
const authController = new AuthController()
const reviewController = new ReviewController()

/**
 * @swagger
 * /health:
 *   get:
 *     summary: Verifica o status da API
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: API está online
 */
routes.get('/health', (req, res) => {
  return res.json({ status: 'ok', api: 'FixNow' })
})

// Rota da documentação Swagger
routes.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))

routes.use('/users', usersRoutes);
routes.use('/categories', categoriesRoutes);
routes.use('/appointments', appointmentsRoutes);

/**
 * @swagger
 * /login:
 *   post:
 *     summary: Autentica um usuário e retorna um token JWT
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login realizado com sucesso
 */
routes.post('/login', authController.handle);

/**
 * @swagger
 * tags:
 *   name: Reviews
 *   description: Gerenciamento de avaliações e comentários
 */

/**
 * @swagger
 * /reviews:
 *   post:
 *     summary: Cria uma nova avaliação para um técnico
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - technicianId
 *               - stars
 *               - comment
 *             properties:
 *               technicianId:
 *                 type: integer
 *                 description: ID do técnico sendo avaliado
 *               stars:
 *                 type: integer
 *                 description: Nota de 1 a 5
 *               comment:
 *                 type: string
 *                 description: Comentário sobre o serviço
 *     responses:
 *       201:
 *         description: Avaliação criada com sucesso
 *       401:
 *         description: Não autorizado (Token ausente ou inválido)
 *       404:
 *         description: Técnico ou Cliente não encontrado
 */
routes.post('/reviews', authMiddleware, reviewController.create)

/**
 * @swagger
 * /reviews/{technicianId}:
 *   get:
 *     summary: Lista as avaliações de um técnico específico
 *     tags: [Reviews]
 *     parameters:
 *       - in: path
 *         name: technicianId
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID do técnico
 *     responses:
 *       200:
 *         description: Lista de avaliações retornada com sucesso
 */
routes.get('/reviews/:technicianId', reviewController.listByTechnician)