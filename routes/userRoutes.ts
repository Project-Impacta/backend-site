import express from 'express'

const router = express.Router()

router.get('/', (req, res) => {
  res.send('Rota de usuários')
})

router.get('/:id', (req, res) => {
  const userId = req.params.id
  res.send(`Detalhes do usuário com ID ${userId}`)
})

router.post('/', (req, res) => {
  req.body('nome')
  req.body('email')
  req.body('perfil')
  req.body('senha')
  req.body('endereco')
})

export default router
