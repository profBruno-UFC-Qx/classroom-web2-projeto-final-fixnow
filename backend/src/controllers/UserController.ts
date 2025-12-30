import { Request, Response } from 'express'
import { CreateUserService } from '../services/CreateUserService'
import { ListUsersService } from '../services/ListUsersService'
import { GetUserByIdService } from '../services/GetUserByIdService'
import { UpdateUserService } from '../services/UpdateUserService'
import { DeleteUserService } from '../services/DeleteUserService'
import { UserRole } from '../entities/User'

export class UserController {
  async create(req: Request, res: Response) {
    const { name, email, password, role } = req.body

    const service = new CreateUserService()
    const user = await service.execute({
      name,
      email,
      password,
      role: role as UserRole // 👈 cast controlado
    })

    return res.status(201).json(user)
  }

  async list(req: Request, res: Response) {
    const service = new ListUsersService()
    const users = await service.execute()

    return res.json(users)
  }

  async show(req: Request, res: Response) {
    const { id } = req.params

    const service = new GetUserByIdService()
    const user = await service.execute(id)

    return res.json(user)
  }

  async update(req: Request, res: Response) {
    const { id } = req.params
    const { name, email, password, role } = req.body

    const service = new UpdateUserService()
    const user = await service.execute({
      id,
      name,
      email,
      password,
      role: role as UserRole // 👈 cast necessário
    })

    return res.json(user)
  }

  async delete(req: Request, res: Response) {
    const { id } = req.params

    const service = new DeleteUserService()
    const result = await service.execute({ id })

    return res.json(result)
  }
}
