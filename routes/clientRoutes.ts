import express from 'express'

import { CPFValidator } from './../utils/CPFValidator'
import ClientModel from './models/clientModel'

const router = express.Router()

interface FormatClient {
  cpf: string
  firstName: string
  lastName: string
  email: string
  phone: string
}

//Consulta base de clientes
router.get('/', async (req, res) => {
  const clients = await ClientModel.find()

  if (clients.length == 0) {
    res.status(400)
    res.send({ message: 'Nem um usuario cadastrado' })
  }

  const array: Array<FormatClient> = new Array<FormatClient>()
  clients.forEach(element => {
    const item: FormatClient = {
      cpf: element.cpf,
      firstName: element.firstName,
      lastName: element.lastName,
      email: element.email,
      phone: element.phone
    }
    array.push(item)
  })

  res.status(200)
  res.send({ clients: array })
})

//Obtem cliente
router.get('/:id', async (req, res) => {
  const client = await ClientModel.find({ cpf: req.params.id })

  if (client.length == 0) {
    res.status(400)
    res.send({ message: 'Nem um cliente cadastrado com cpf informado' })
  } else if (client.length == 2) {
    res.status(400)
    res.send({ message: 'Mais de um cliente cadastrado com cpf informado' })
  }

  const array: Array<FormatClient> = new Array<FormatClient>()
  client.forEach(element => {
    const item: FormatClient = {
      cpf: element.cpf,
      firstName: element.firstName,
      lastName: element.lastName,
      email: element.email,
      phone: element.phone
    }
    array.push(item)
  })

  res.status(200)
  res.send({ client: array })
})

//Cadatra cliente
router.post('/', async (req, res) => {
  const isValidCPF = new CPFValidator().handle(req.body.cpf)
  if (!isValidCPF) {
    res.status(401)
    res.send({ message: 'CPF invalido' })
    return
  }

  let cli = await ClientModel.findOne({ cpf: req.body.cpf })
  if (cli) {
    res.status(401)
    res.send({ message: 'CPF ja cadastrado' })
    return
  }

  cli = await ClientModel.findOne({ email: req.body.email })
  if (cli) {
    res.status(401)
    res.send({ message: 'Email ja cadastrado' })
    return
  }
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
      res.status(201)
      res.send({ message: 'Cliente cadastrado com sucesso!' })
      return
    })
    .catch(error => {
      res.status(400)
      res.send({ message: 'Erro ao cadastrar cliente:' + error })
      return
    })
})

//Atualiza email
router.patch('/updateEmail', (req, res) => {
  try {
    ClientModel.findOneAndUpdate(
      { cpf: req.body.cpf },
      {
        $push: {
          email: req.body.email
        }
      }
    )
    res.send({ message: `Email do cliente atualizado com sucesso.` })
  } catch {
    res.send({ message: `Nao foi possivel atualizar o email do usuario.` })
  }
})

//Atualiza senha
router.patch('/updatePassword', (req, res) => {
  try {
    ClientModel.findOneAndUpdate(
      { cpf: req.body.cpf, password: req.body.password },
      {
        $push: {
          password: req.body.newPassword
        }
      }
    )
    res.send({ message: `Senha do cliente atualizado com sucesso.` })
  } catch {
    res.send({ message: `Nao foi possivel atualizar o senha do usuario.` })
  }
})

export default router
