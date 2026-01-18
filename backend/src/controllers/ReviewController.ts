import { Request, Response } from 'express'
import { AppDataSource } from '../data-source'
import { Review } from '../entities/Review'
import { User } from '../entities/User'

export class ReviewController {
  async create(req: Request, res: Response) {
    const { technicianId, stars, comment } = req.body
    const clientId = (req as any).user.id

    const userRepository = AppDataSource.getRepository(User)
    const reviewRepository = AppDataSource.getRepository(Review)

    const technician = await userRepository.findOneBy({ id: technicianId })
    const client = await userRepository.findOneBy({ id: clientId })

    if (!technician) {
      return res.status(404).json({ message: 'Técnico não encontrado' })
    }

    if (!client) {
      return res.status(404).json({ message: 'Cliente não encontrado' })
    }

    if (technician.id === client.id) {
      return res.status(400).json({ message: 'Você não pode se autoavaliar' })
    }

    const review = new Review()
    review.stars = stars
    review.comment = comment
    review.client = client
    review.technician = technician

    await reviewRepository.save(review)

    return res.status(201).json(review)
  }

  async listByTechnician(req: Request, res: Response) {
    const { technicianId } = req.params
    console.log(`🔍 Buscando reviews para o técnico ID: ${technicianId}`)

    const reviewRepository = AppDataSource.getRepository(Review)

    const reviews = await reviewRepository.find({
      where: { technician: { id: Number(technicianId) } },
      relations: ['client'],
      order: { created_at: 'DESC' },
    })

    console.log(`✅ Encontradas ${reviews.length} avaliações.`)

    return res.json(reviews)
  }
}