import { AppDataSource } from '../data-source'
import { Category } from '../entities/Category'

interface IRequest {
  id: string
}

export class DeleteCategoryService {
  async execute({ id }: IRequest) {
    const categoriesRepository = AppDataSource.getRepository(Category)

    const category = await categoriesRepository.findOne({
      where: { id: Number(id) }
    })

    if (!category) {
      throw new Error('Categoria não encontrada')
    }

    await categoriesRepository.remove(category)

    return { message: 'Categoria deletada com sucesso' }
  }
}
