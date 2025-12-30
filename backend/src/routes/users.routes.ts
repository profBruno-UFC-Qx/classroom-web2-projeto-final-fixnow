import { Router } from 'express'
import { UserController } from '../controllers/UserController'

const usersRoutes = Router()
const userController = new UserController()

usersRoutes.post('/', userController.create)
usersRoutes.get('/', userController.list)
usersRoutes.get('/:id', userController.show)
usersRoutes.put('/:id', userController.update)
usersRoutes.delete('/:id', userController.delete)

export { usersRoutes }
