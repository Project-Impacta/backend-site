import express from 'express'

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
}

async function getProfile(cpf: string, password: string): Promise<ResAuth | undefined> {
  // Valida na base de admins
  const admin = await AdminModel.findOne({ cpf: cpf, password: password })
  if (admin) {
    //Tratar admin com cpf e primeiro nome
    const data: User = { cpf: admin.cpf, firstName: admin.firstName }
    return { type: 'admin', data: data }
  }

  // Valida na base de clientes
  const cliente = await ClientModel.findOne({ cpf: cpf, password: password })
  if (cliente) {
    //Tratar cliente com cpf e primeiro nome
    const data: User = { cpf: cliente.cpf, firstName: cliente.firstName }
    return { type: 'cliente', data: data }
  }

  // Se não encontrou em nenhuma das bases
  return undefined
}

// Autenticacao no site
router.get('/auth', async (req, res) => {
  try {
    const profile = await getProfile(req.body.cpf, req.body.password)
    if (profile != undefined) {
      res.status(200)
      res.send({ message: 'Autenticado', profile: { type: profile.type, user: profile.data } })
    } else {
      res.status(400)
      res.send({ message: 'Usuario com a senha informada nao encontrado.' })
    }
  } catch (error) {
    res.status(401)
    res.send({ message: 'Erro ao validar login:' + error })
  }
})

export default router
