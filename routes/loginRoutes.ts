import express from 'express'
// import bcrpty from 'bcrypt'
import jwt from 'jsonwebtoken'

import { JWT_PASS } from '../enviroment'
import { BadResquestError } from '../utils/APIError'
import AdminModel from './models/adminModel'
import ClientModel from './models/clientModel'

const router = express.Router()

interface ResAuth {
  type: string
  data: User
}

interface User {
  cpf: string
  firstName: string
  email: string
}

async function getProfile(cpf: string, password: string): Promise<ResAuth | undefined> {
  // const cryptPass = bcrypt.hash(password, 10);
  // Valida na base de admins
  const admin = await AdminModel.findOne({ cpf: cpf, password: password })
  if (admin) {
    const data: User = { cpf: admin.cpf, firstName: admin.firstName, email: admin.email }
    return { type: 'admin', data: data }
  }

  // Valida na base de clientes
  const cliente = await ClientModel.findOne({ cpf: cpf, password: password })
  if (cliente) {
    const data: User = { cpf: cliente.cpf, firstName: cliente.firstName, email: cliente.email }
    return { type: 'cliente', data: data }
  }

  // Se não encontrou em nenhuma das bases
  return undefined
}

// Autenticacao no site
router.post('/auth', async (req, res) => {
  try {
    const { cpf, password } = req.body
    console.log('Received request:', { cpf, password })
    const profile = await getProfile(cpf, password)
    if (profile !== undefined) {
      const token = jwt.sign({ profile: { type: profile.type, user: profile.data } }, JWT_PASS, { expiresIn: '8h' })
      console.log('Authentication successful:', { profile, token })
      return res.status(200).json({ message: 'Autenticado', token: token, profile: { type: profile.type, user: profile.data } })
    } else {
      console.log('Authentication failed: user not found')
      return res.status(400).json({ message: 'Usuario com a senha informada nao encontrado.' })
    }
  } catch (error) {
    console.error('Error during authentication:', error)
    throw new BadResquestError('Erro ao validar login: ' + error)
  }
})

export default router
