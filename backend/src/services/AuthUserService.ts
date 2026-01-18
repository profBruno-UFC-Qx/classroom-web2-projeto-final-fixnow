import { AppDataSource } from '../data-source'
import { User } from '../entities/User'
import bcrypt from 'bcrypt'

interface IRequest {
  email: string
  password: string
}

export class AuthUserService {
  async execute({ email, password }: IRequest) {
    const usersRepository = AppDataSource.getRepository(User)

    const user = await usersRepository.findOne({
      where: { email },
    })

    if (!user) {
      throw new Error('Email ou senha incorretos')
    }

    const passwordMatch = await bcrypt.compare(password, user.password)

    if (!passwordMatch) {
      throw new Error('Email ou senha incorretos')
    }

    return user
  }
}