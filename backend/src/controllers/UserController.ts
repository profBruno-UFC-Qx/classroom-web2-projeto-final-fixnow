import { Request, Response } from 'express'
import { CreateUserService } from '../services/CreateUserService'
import { ListUsersService } from '../services/ListUsersService'
import { GetUserByIdService } from '../services/GetUserByIdService'
import { UpdateUserService } from '../services/UpdateUserService'
import { UpdateProfileImageService } from '../services/UpdateProfileImageService'
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
      role: role as UserRole // cast controlado
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
    const { name, email, password, role, profession, phone } = req.body
    const userId = (req as any).user?.id

    // Verificar autorização: apenas pode atualizar sua própria conta
    if (userId !== Number(id)) {
      return res.status(403).json({ 
        message: 'Acesso negado: você só pode atualizar sua própria conta' 
      })
    }

    try {
      const service = new UpdateUserService()
      const user = await service.execute({
        id,
        name,
        email,
        password,
        role: role as UserRole, //  cast necessário
        profession,
        phone
      })

      return res.json(user)
    } catch (error: any) {
      console.error('Erro ao atualizar usuário:', error)
      return res.status(400).json({ 
        message: error.message || 'Erro ao atualizar perfil' 
      })
    }
  }

  async uploadProfileImage(req: Request, res: Response) {
    const { id } = req.params
    const { profileImage } = req.body
    const userId = (req as any).user?.id

    // Verificar autorização
    if (userId !== Number(id)) {
      return res.status(403).json({ 
        message: 'Acesso negado: você só pode atualizar sua própria foto' 
      })
    }

    if (!profileImage) {
      return res.status(400).json({ 
        message: 'Imagem é obrigatória' 
      })
    }

    try {
      const service = new UpdateProfileImageService()
      const user = await service.execute({
        id,
        profileImage
      })

      return res.json(user)
    } catch (error: any) {
      console.error('Erro ao fazer upload da imagem:', error)
      return res.status(400).json({ 
        message: error.message || 'Erro ao fazer upload da imagem' 
      })
    }
  }

  async delete(req: Request, res: Response) {
    const { id } = req.params
    const userId = (req as any).user?.id

    // Verificar autorização: apenas pode deletar sua própria conta
    if (userId !== Number(id)) {
      return res.status(403).json({ 
        message: 'Acesso negado: você só pode deletar sua própria conta' 
      })
    }

    const service = new DeleteUserService()
    const result = await service.execute({ id })

    return res.json(result)
  }

  public getCategories(req: Request, res: Response) {
    const categories = [
      'Eletricista',
      'Encanador',
      'Pedreiro',
      'Carpinteiro',
      'Pintor',
      'Mecânico',
      'Soldador',
      'Refrigeração',
      'Gás',
      'Telecomunicações',
      'Outro'
    ];

    return res.json(categories);
  }

  async seedAdmin(req: Request, res: Response) {
    try {
      //  Verifica se já existe algum administrador no sistema
      const listService = new ListUsersService()
      const users = await listService.execute()
      const adminExists = users.some((u: any) => u.role === 'ADMIN')

      if (adminExists) {
        return res.status(403).json({ message: "Acesso negado: Já existe um administrador cadastrado no sistema." })
      }

      const service = new CreateUserService()
      const user = await service.execute({
        name: "Administrador",
        email: "admin@fixnow.com",
        password: "admin",
        role: "ADMIN" as UserRole
      })
      return res.status(201).json(user)
    } catch (error: any) {
      return res.status(400).json({ message: "Erro ao criar admin (talvez já exista): " + error.message })
    }
  }
}
