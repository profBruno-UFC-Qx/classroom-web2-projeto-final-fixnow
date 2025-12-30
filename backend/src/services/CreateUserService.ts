import { AppDataSource } from '../data-source'
import { User, UserRole } from '../entities/User'
import bcrypt from 'bcrypt'

interface IRequest {
  name: string
  email: string
  password: string
  role?: UserRole
}

export class CreateUserService {
  async execute({ name, email, password, role = UserRole.CLIENTE }: IRequest) {
    const usersRepository = AppDataSource.getRepository(User)

    const userAlreadyExists = await usersRepository.findOne({
      where: { email },
    })

    if (userAlreadyExists) {
      throw new Error('Usuário já existe')
    }

    const hashedPassword = await bcrypt.hash(password, 8)

    const user = usersRepository.create({
      name,
      email,
      password: hashedPassword,
      role,
    })

    await usersRepository.save(user)

    return user
  }
}
