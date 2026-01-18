import { AppDataSource } from '../data-source'
import { User, UserRole } from '../entities/User'
import bcrypt from 'bcrypt'

interface UpdateUserDTO {
  id: string
  name?: string
  email?: string
  password?: string
  role?: UserRole
  profession?: string
  phone?: string
}

export class UpdateUserService {
  async execute({ id, name, email, password, role, profession, phone }: UpdateUserDTO) {
    const userRepository = AppDataSource.getRepository(User)

    const userId = Number(id)
    if (isNaN(userId)) {
      throw new Error('ID inválido')
    }

    const user = await userRepository.findOne({
      where: { id: userId },
    })

    if (!user) {
      throw new Error('Usuário não encontrado')
    }

    // Se o email está sendo alterado, verificar se já existe outro usuário com este email
    if (email && email !== user.email) {
      const existingUser = await userRepository.findOne({
        where: { email }
      })
      
      if (existingUser) {
        throw new Error('Este email já está sendo utilizado por outro usuário')
      }
    }

    if (name) user.name = name
    if (email) user.email = email

    if (password) {
      user.password = await bcrypt.hash(password, 8)
    }

    if (role) {
      user.role = role
    }

    if (profession !== undefined) {
      user.profession = profession
    }

    if (phone !== undefined) {
      user.phone = phone
    }

    await userRepository.save(user)

    return user
  }
}
