import express from 'express'

import connectToMongoDB from './mongoConfig'
import routes from './routes/index'

const app = express()
const port = 10000

// Conectar ao MongoDB
connectToMongoDB()

app.use(express.json())
app.use(routes)

// Inicie o servidor
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`)
})
