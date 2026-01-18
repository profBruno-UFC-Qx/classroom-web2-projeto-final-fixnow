import { AppDataSource } from '../data-source'
import { Category } from '../entities/Category'

export class ListCategoriesService {
  async execute() {
    const categoriesRepository = AppDataSource.getRepository(Category)
    
    const categories = await categoriesRepository.find({
      order: {
        name: 'ASC'
      }
    })

    return categories
  }
}
