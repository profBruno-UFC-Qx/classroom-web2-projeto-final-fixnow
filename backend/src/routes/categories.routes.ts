import { Router } from 'express'
import { CategoryController } from '../controllers/CategoryController'
import { authMiddleware } from '../middlewares/authMiddleware'
import { adminMiddleware } from '../middlewares/adminMiddleware'

const categoriesRoutes = Router()
const categoryController = new CategoryController()

/**
 * @swagger
 * /categories:
 *   get:
 *     summary: Lista todas as categorias
 *     tags: [Categories]
 *     responses:
 *       200:
 *         description: Lista de categorias
 */
categoriesRoutes.get('/', categoryController.list)

/**
 * @swagger
 * /categories:
 *   post:
 *     summary: Cria uma nova categoria (requer ADMIN)
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *     responses:
 *       201:
 *         description: Categoria criada
 *       401:
 *         description: Não autorizado
 *       403:
 *         description: Acesso negado (apenas admins)
 */
categoriesRoutes.post('/', authMiddleware, adminMiddleware, categoryController.create)

/**
 * @swagger
 * /categories/{id}:
 *   delete:
 *     summary: Deleta uma categoria (requer ADMIN)
 *     tags: [Categories]
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
 *         description: Categoria deletada
 *       401:
 *         description: Não autorizado
 *       403:
 *         description: Acesso negado (apenas admins)
 */
categoriesRoutes.delete('/:id', authMiddleware, adminMiddleware, categoryController.delete)

export { categoriesRoutes }
