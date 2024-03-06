import express from 'express'

const router = express.Router()

router.get('/', (req, res) => {
  res.send('Rota de usuários')
})

router.get('/:id', (req, res) => {
  const userId = req.params.id
  res.send(`Detalhes do usuário com ID ${userId}`)
})

router.post('', (req, res) => {
  req.body('userId')
  req.body('produtos')
})

router.patch('', (req, res) => {
  req.body('userId')
  req.body('produtos')
})

router.delete('', (req, res) => {
  req.body('userId')
  req.body('produtos')
})

export default router
