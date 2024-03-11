import express from 'express'

import adminRoutes from './adminRoutes'
import clientRoutes from './clientRoutes'
import loginRoutes from './loginRoutes'
import productsRoutes from './productsRoutes'
import purchaseRoutes from './purchaseRoutes'
import shoppingCartRoutes from './shoppingCartRoutes'

const router = express.Router()

// Defina uma rota básica
router.get('/', (req, res) => {
  res.send('Bem-vindo à minha API!')
})

router.use('/admin', adminRoutes)
router.use('/client', clientRoutes)
router.use('/product', productsRoutes)
router.use('/purchase', purchaseRoutes)
router.use('/shoppingCartCart', shoppingCartRoutes)
router.use('/login', loginRoutes)

export default router
