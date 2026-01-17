import { Router } from 'express'
import { UserController } from '../controllers/UserController'
import { authMiddleware } from '../middlewares/authMiddleware'

const usersRoutes = Router()
const userController = new UserController()

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: Gerenciamento de usuários
 */

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Cria um novo usuário
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               role:
 *                 type: string
 *                 enum: [CLIENTE, TECNICO, ADMIN]
 *     responses:
 *       201:
 *         description: Usuário criado
 */
usersRoutes.post('/', userController.create)

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Lista todos os usuários
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Lista de usuários
 */
usersRoutes.get('/', userController.list)

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Obtém um usuário pelo ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Dados do usuário
 */
usersRoutes.get('/:id', userController.show)

/**
 * @swagger
 * /users/{id}:
 *   put:
 *     summary: Atualiza um usuário (requer autenticação)
 *     tags: [Users]
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
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               role:
 *                 type: string
 *     responses:
 *       200:
 *         description: Usuário atualizado
 *       401:
 *         description: Não autorizado
 *       403:
 *         description: Acesso negado (apenas pode atualizar sua própria conta)
 */
usersRoutes.put('/:id', authMiddleware, userController.update)

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Remove um usuário (requer autenticação)
 *     tags: [Users]
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
 *         description: Usuário removido
 *       401:
 *         description: Não autorizado
 *       403:
 *         description: Acesso negado (apenas pode deletar sua própria conta)
 */
usersRoutes.delete('/:id', authMiddleware, userController.delete)

/**
 * @swagger
 * /users/{id}/profile-image:
 *   post:
 *     summary: Faz upload da foto de perfil (requer autenticação)
 *     tags: [Users]
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
 *               - profileImage
 *             properties:
 *               profileImage:
 *                 type: string
 *                 description: Imagem em formato base64 (data:image/...)
 *     responses:
 *       200:
 *         description: Foto de perfil atualizada
 *       400:
 *         description: Erro ao fazer upload
 *       401:
 *         description: Não autorizado
 *       403:
 *         description: Acesso negado (apenas pode atualizar sua própria foto)
 */
usersRoutes.post('/:id/profile-image', authMiddleware, userController.uploadProfileImage)

export { usersRoutes }
