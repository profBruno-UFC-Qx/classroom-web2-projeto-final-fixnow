import { AppDataSource } from '../data-source'
import { User } from '../entities/User'

export class GetUserByIdService {
  async execute(id: string) {
    const userRepository = AppDataSource.getRepository(User)

    const userId = Number(id)

    if (isNaN(userId)) {
      throw new Error('ID inválido')
    }

    const user = await userRepository.findOne({
      where: { id: userId }
    })

    if (!user) {
      throw new Error('Usuário não encontrado')
    }

    return user
  }
}
