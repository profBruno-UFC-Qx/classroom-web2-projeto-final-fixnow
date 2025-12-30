import 'dotenv/config'
import express from 'express'
import cors from 'cors'

import { routes } from './routes'
import { AppDataSource } from './data-source'

const app = express()

app.use(cors())
app.use(express.json())
app.use(routes)

const PORT = process.env.PORT || 3333

AppDataSource.initialize()
  .then(() => {
    console.log('📦 Banco de dados conectado')

    app.listen(PORT, () => {
      console.log(`🚀 Backend FixNow rodando na porta ${PORT}`)
    })
  })
  .catch((error) => {
    console.error('Erro ao conectar no banco', error)
  })
