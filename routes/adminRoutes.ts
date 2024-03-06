import express from 'express'

import AdminModel from './models/adminModel'

const router = express.Router()

//Consulta base de admins
router.get('/', (req, res) => {
  res.send('Rota de admins')
})

//Consulta admin
router.get('/:id', (req, res) => {
  const userId = req.params.id
  res.send(`Detalhes do admin com ID ${userId}`)
})

//Cadastra admin
router.post('/', (req, res) => {
  const adminModel = new AdminModel({
    cpf: req.body.cpf,
    name: req.body.name,
    password: req.body.password
  })

  adminModel
    .save()
    .then(() => {
      res.send('Admin cadastrado com sucesso!')
    })
    .catch(error => {
      res.status(400)
      res.send('Erro ao cadastrar admin:' + error)
    })
})

export default router
