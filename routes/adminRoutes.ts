import express from 'express'

import { BadResquestError, NotFoundError } from '../utils/APIError'
import { CPFValidator } from '../utils/CPFValidator'
import AdminModel from './models/adminModel'
import ClientModel from './models/clientModel'

const router = express.Router()

interface FormatAdmin {
  cpf: string
  firstName: string
  lastName: string
  email: string
}

//Consulta base de admins
router.get('/', async (req, res) => {
  const clients = await AdminModel.find()

  if (clients.length == 0) {
    throw new NotFoundError('Nem um admin cadastrado')
  }

  const array: Array<FormatAdmin> = new Array<FormatAdmin>()
  clients.forEach(element => {
    const item: FormatAdmin = {
      cpf: element.cpf,
      firstName: element.firstName,
      lastName: element.lastName,
      email: element.email
    }
    array.push(item)
  })

  return res.status(200).json({ data: array })
})

//Consulta admin
router.get('/:id', async (req, res) => {
  const client = await AdminModel.find({ cpf: req.params.id })

  if (client.length == 0) {
    throw new NotFoundError('Nem um admin cadastrado com cpf informado')
  } else if (client.length == 2) {
    throw new BadResquestError('Mais de um admin cadastrado com cpf informado')
  }

  const array: Array<FormatAdmin> = new Array<FormatAdmin>()
  client.forEach(element => {
    const item: FormatAdmin = {
      cpf: element.cpf,
      firstName: element.firstName,
      lastName: element.lastName,
      email: element.email
    }
    array.push(item)
  })

  return res.status(200).json({ client: array })
})

//Cadastra admin
router.post('/', async (req, res) => {
  const { cpf, firstName, lastName, email, password } = req.body

  const isValidCPF = new CPFValidator().handle(cpf)
  if (!isValidCPF) {
    return new BadResquestError('CPF invalido')
  }

  const cli = await ClientModel.findOne({ cpf: cpf })
  if (cli) {
    return new BadResquestError('CPF ja cadastrado como cliente')
  }

  const adm = await AdminModel.findOne({ cpf: cpf })
  if (adm) {
    return new BadResquestError('CPF ja cadastrado como admin')
  }

  const adminModel = new AdminModel({
    cpf,
    firstName,
    lastName,
    email,
    password
  })

  adminModel
    .save()
    .then(() => {
      return res.status(200).json({ message: 'Admin cadastrado com sucesso!' })
    })
    .catch(error => {
      return new BadResquestError('Erro ao cadastrar admin:' + error)
    })
})

export default router
