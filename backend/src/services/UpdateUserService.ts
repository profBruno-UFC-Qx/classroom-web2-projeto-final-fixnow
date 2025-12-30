import { AppDataSource } from '../data-source'
import { User, UserRole } from '../entities/User'
import bcrypt from 'bcrypt'

interface UpdateUserDTO {
  id: string
  name?: string
  email?: string
  password?: string
  role?: UserRole
}

export class UpdateUserService {
  async execute({ id, name, email, password, role }: UpdateUserDTO) {
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

    if (name) user.name = name
    if (email) user.email = email

    if (password) {
      user.password = await bcrypt.hash(password, 8)
    }

    if (role) {
      user.role = role
    }

    await userRepository.save(user)

    return user
  }
}
