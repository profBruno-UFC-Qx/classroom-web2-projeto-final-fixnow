import { Router } from 'express'
import { usersRoutes } from './users.routes'
import { AuthController } from '../controllers/AuthController'

export const routes = Router()
const authController = new AuthController()

routes.get('/health', (req, res) => {
  return res.json({ status: 'ok', api: 'FixNow' })
})

routes.use('/users', usersRoutes);
routes.post('/login', authController.handle);