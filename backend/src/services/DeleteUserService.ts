import { AppDataSource } from '../data-source'
import { User } from '../entities/User'

interface DeleteUserDTO {
  id: string
}

export class DeleteUserService {
  async execute({ id }: DeleteUserDTO) {
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

    await userRepository.remove(user)

    return { message: 'Usuário removido com sucesso' }
  }
}
