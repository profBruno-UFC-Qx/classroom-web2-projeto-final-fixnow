import { Request, Response, NextFunction } from 'express'
import * as jwt from 'jsonwebtoken'
import authConfig from '../config/auth'

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization

  if (!authHeader) {
    return res.status(401).json({ message: 'Token não fornecido' })
  }

  const parts = authHeader.split(' ')
  
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return res.status(401).json({ message: 'Formato de token inválido. Use: Bearer TOKEN' })
  }

  const token = parts[1]

  try {
    const decoded = jwt.verify(token, authConfig.jwt.secret as string)
    ;(req as any).user = decoded
    const payload = decoded as jwt.JwtPayload
    console.log('Token validado para usuário:', payload.email)
    next()
  } catch (err: any) {
    console.error('Erro ao verificar token:', err.message)
    return res.status(401).json({ message: 'Token inválido ou expirado' })
  }
}