import express from 'express'

// import bcrpty from 'bcrypt'
import { BadResquestError, NotFoundError } from '../utils/APIError'
import { CPFValidator } from './../utils/CPFValidator'
import AdminModel from './models/adminModel'
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
    throw new NotFoundError('Nem um usuario cadastrado')
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

  return res.status(200).json({ clients: array })
})

//Obtem cliente
router.get('/:id', async (req, res) => {
  const client = await ClientModel.find({ cpf: req.params.id })

  if (client.length == 0) {
    throw new NotFoundError('Nem um cliente cadastrado com cpf informado')
  } else if (client.length == 2) {
    throw new BadResquestError('Mais de um cliente cadastrado com cpf informado')
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

  return res.status(200).json({ client: array })
})

//Cadatra cliente
router.post('/', async (req, res) => {
  const { cpf, firstName, lastName, email, password, phone } = req.body
  // const newPassword = bcrpty.hash(password, 10)
  const isValidCPF = new CPFValidator().handle(cpf)
  if (!isValidCPF) {
    throw new BadResquestError('CPF invalido')
  }

  let cli = await ClientModel.findOne({ cpf: cpf })
  if (cli) {
    throw new BadResquestError('CPF ja cadastrado como cliente')
  }

  const adm = await AdminModel.findOne({ cpf: cpf })
  if (adm) {
    throw new BadResquestError('CPF ja cadastrado como admin')
  }

  cli = await ClientModel.findOne({ email: email })
  if (cli) {
    throw new BadResquestError('Email ja cadastrado')
  }
  const clientModel = new ClientModel({
    cpf,
    firstName,
    lastName,
    email,
    password,
    phone
  })

  clientModel
    .save()
    .then(() => {
      return res.status(201).json({ message: 'Cliente cadastrado com sucesso!' })
    })
    .catch(error => {
      throw new BadResquestError('Erro ao cadastrar cliente:' + error)
    })
})

//Atualiza email
router.patch('/updateEmail', (req, res) => {
  const { cpf, email, password } = req.body
  ClientModel.findOneAndUpdate(
    { cpf: cpf, password: password },
    {
      $push: {
        email: email
      }
    }
  ).catch(error => {
    console.log('Nao foi possivel atualizar o email do usuario.' + error)
    throw new BadResquestError('Nao foi possivel atualizar o email do usuario.')
  })
  return res.status(201).json({ message: 'Email do cliente atualizado com sucesso.' })
})

//Atualiza senha
router.patch('/updatePassword', (req, res) => {
  const { cpf, oldPassword, newPassword } = req.body

  ClientModel.findOneAndUpdate(
    { cpf: cpf, password: oldPassword },
    {
      $push: {
        password: newPassword
      }
    }
  ).catch(error => {
    console.log('Nao foi possivel atualizar a senha do usuario.' + error)
    throw new BadResquestError('Nao foi possivel atualizar a senha do usuario.')
  })
  return res.status(201).json({ message: 'Senha do cliente atualizado com sucesso.' })
})

export default router
