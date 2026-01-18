import { Request, Response } from 'express'
import { ListCategoriesService } from '../services/ListCategoriesService'
import { CreateCategoryService } from '../services/CreateCategoryService'
import { DeleteCategoryService } from '../services/DeleteCategoryService'

export class CategoryController {
  async list(req: Request, res: Response) {
    const service = new ListCategoriesService()
    const categories = await service.execute()

    return res.json(categories)
  }

  async create(req: Request, res: Response) {
    const { name } = req.body

    if (!name) {
      return res.status(400).json({ message: 'Nome da categoria é obrigatório' })
    }

    try {
      const service = new CreateCategoryService()
      const category = await service.execute({ name })

      return res.status(201).json(category)
    } catch (error: any) {
      return res.status(400).json({ message: error.message })
    }
  }

  async delete(req: Request, res: Response) {
    const { id } = req.params

    try {
      const service = new DeleteCategoryService()
      const result = await service.execute({ id })

      return res.json(result)
    } catch (error: any) {
      return res.status(400).json({ message: error.message })
    }
  }
}
