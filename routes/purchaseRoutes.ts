import express from 'express'

const router = express.Router()

//Consulta base pedidos
router.get('/', (req, res) => {
  return res.json({ message: 'Rota de usuários' })
})

//Consulta pedido pelo numero/id
router.get('/:id', (req, res) => {
  const pruchaseId = req.params.id
  return res.status(200).json({ message: `Detalhes do usuário com ID ${pruchaseId}` })
})

//Em contrucao

export default router
