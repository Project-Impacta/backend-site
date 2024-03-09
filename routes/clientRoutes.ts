import express from 'express'

import ClientModel from './models/clientModel'

const router = express.Router()

//Consulta base de usuarios
router.get('/', (req, res) => {
  res.send('Rota de usuários')
})

//Obtem usuario
router.get('/:id', (req, res) => {
  const userId = req.params.id
  res.send(`Detalhes do usuário com ID ${userId}`)
})

//Cadatra usuario
router.post('/', (req, res) => {
  const clientModel = new ClientModel({
    cpf: req.body.cpf,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    password: req.body.password,
    phone: req.body.phone
  })

  clientModel
    .save()
    .then(() => {
      res.send('Cliente cadastrado com sucesso!')
    })
    .catch(error => {
      res.status(400)
      res.send('Erro ao cadastrar cliente:' + error)
    })
})

//Atualiza email e senha
router.patch('/', (req, res) => {
  try {
    ClientModel.findOneAndUpdate(
      { cpf: req.body.cpf },
      {
        $push: {
          email: req.body.email,
          password: req.body.password
        }
      }
    )
    res.send(`Email e senha atualizados com sucesso.`)
  } catch {
    res.send(`Nao foi possivel atualizar o cadastro do usuario.`)
  }
})

export default router
