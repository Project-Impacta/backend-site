import express from 'express'
import userRoutes from './userRoutes'

const router = express.Router()

router.use('/users', userRoutes)
router.use('/products', userRoutes)
router.use('/purchase', userRoutes)
router.use('/shoppingCart', userRoutes)

export default router
