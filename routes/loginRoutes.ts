import express from 'express'

import AdminModel from './models/adminModel'
import ClientModel from './models/clientModel'

const router = express.Router()

// Autenticacao no site
router.get('/auth', async (req, res) => {
  const cpf = req.body.cpf
  const senha = req.body.senha

  try {
    // Valida na base de admins
    const admin = await AdminModel.findOne({ cpf, password: senha }).exec()
    if (admin) {
      return { tipo: 'admin', usuario: admin }
    }

    // Valida na base de clientes
    const cliente = await ClientModel.findOne({ cpf, password: senha }).exec()
    if (cliente) {
      return { tipo: 'cliente', usuario: cliente }
    }

    // Se não encontrou em nenhuma das bases
    return null
  } catch (error) {
    res.status(400)
    res.send('Erro ao validar login:' + error)
    throw error
  }
})

export default router
