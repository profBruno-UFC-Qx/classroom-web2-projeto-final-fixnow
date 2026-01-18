import { Request, Response } from 'express'
import { AuthUserService } from '../services/AuthUserService'
import jwt from 'jsonwebtoken'
import authConfig from '../config/auth'

export class AuthController {
  async handle(req: Request, res: Response) {
    const { email, password } = req.body

    const authUserService = new AuthUserService()

    const user = await authUserService.execute({ email, password })

    // Gerar token JWT
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      authConfig.jwt.secret as string,
      { expiresIn: authConfig.jwt.expiresIn }
    )

    console.log('Token gerado com sucesso para usuário:', user.email)

    return res.json({
      user,
      token
    })
  }
}