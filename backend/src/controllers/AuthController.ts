import { Request, Response } from 'express'
import { AuthUserService } from '../services/AuthUserService'

export class AuthController {
  async handle(req: Request, res: Response) {
    const { email, password } = req.body

    const authUserService = new AuthUserService()

    const user = await authUserService.execute({ email, password })

    return res.json(user)
  }
}