import { AppDataSource } from '../data-source'
import { Category } from '../entities/Category'

interface IRequest {
  name: string
}

export class CreateCategoryService {
  async execute({ name }: IRequest) {
    const categoriesRepository = AppDataSource.getRepository(Category)

    const categoryAlreadyExists = await categoriesRepository.findOne({
      where: { name }
    })

    if (categoryAlreadyExists) {
      throw new Error('Categoria já existe')
    }

    const category = categoriesRepository.create({
      name
    })

    await categoriesRepository.save(category)

    return category
  }
}
