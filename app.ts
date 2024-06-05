import 'express-async-errors'

import cors from 'cors'
import express from 'express'

import { CORS_URL, PORT } from './enviroment'
import { errorMiddleware } from './middlewares/erros'
import connectToMongoDB from './mongoConfig'
import routes from './routes/index'

const app = express()
const port = PORT

// Conectar ao MongoDB
connectToMongoDB()

// Habilitando o cors
app.use(
  cors({
    origin: CORS_URL?.split(';')
  })
)

app.use(express.json())
app.use(routes)
app.use(errorMiddleware)

// Inicie o servidor
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`)
})
