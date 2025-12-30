import { Router } from 'express'
import { usersRoutes } from './users.routes'

export const routes = Router()

routes.get('/health', (req, res) => {
  return res.json({ status: 'ok', api: 'FixNow' })
})

routes.use('/users', usersRoutes);