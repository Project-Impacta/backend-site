import cors from 'cors'
import express from 'express'

import connectToMongoDB from './mongoConfig'
import routes from './routes/index'

const app = express()
const port = 3333

// Conectar ao MongoDB
connectToMongoDB()

// Habilitando o cors
app.use(cors())

app.use(express.json())
app.use(routes)

// Inicie o servidor
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`)
})
