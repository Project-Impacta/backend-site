import express from 'express'

const router = express.Router()

//Consulta base pedidos
router.get('/', (req, res) => {
  res.send('Rota de usuários')
})

//Consulta pedido pelo numero/id
router.get('/:id', (req, res) => {
  const pruchaseId = req.params.id
  res.send(`Detalhes do usuário com ID ${pruchaseId}`)
})

//Em contrucao

export default router
