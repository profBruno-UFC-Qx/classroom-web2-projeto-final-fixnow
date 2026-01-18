import { AppDataSource } from '../data-source'
import { User } from '../entities/User'

interface UpdateProfileImageDTO {
  id: string
  profileImage: string // base64 ou URL
}

export class UpdateProfileImageService {
  async execute({ id, profileImage }: UpdateProfileImageDTO) {
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

    // Validar se é uma string base64 válida
    if (profileImage && !profileImage.startsWith('data:image')) {
      throw new Error('Formato de imagem inválido')
    }

    user.profileImage = profileImage

    await userRepository.save(user)

    return user
  }
}
