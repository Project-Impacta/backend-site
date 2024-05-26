import express from 'express'

import upload from '../config/multer'
import { authFrontend } from '../middlewares/authFrontend'
import adminRoutes from './adminRoutes'
import clientRoutes from './clientRoutes'
import loginRoutes from './loginRoutes'
import productsImageRoutes from './productsImageRoutes'
import productsRoutes from './productsRoutes'
import purchaseRoutes from './purchaseRoutes'
import shoppingCartRoutes from './shoppingCartRoutes'

const router = express.Router()

// Defina uma rota básica
router.get('/', (req, res) => {
  res.json({ message: 'Bem-vindo à Impacta!' })
})

router.use('/login', authFrontend, loginRoutes)
router.use('/admin', authFrontend, adminRoutes)
router.use('/client', authFrontend, clientRoutes)
router.use('/product', authFrontend, productsRoutes)
router.use('/productImage', upload.single('image'), productsImageRoutes)
router.use('/purchase', authFrontend, purchaseRoutes)

//ROTAS OBSOLETAS
router.use('/shoppingCartCart', authFrontend, shoppingCartRoutes)

export default router
