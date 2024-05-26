import express, { Request, Response } from 'express'

import { NotFoundError } from '../utils/APIError'
import ProductModel from './models/productModel'
import ShoppingCartModel from './models/shoppingCartModel'

const router = express.Router()

//ROTAS OBSOLETAS

// Cria um carrinho para o usuario
router.post('/', async (req: Request, res: Response) => {
  const { cpf } = req.body

  // Verifica se tem algum carrinho com itens dentro
  let shoppingCart = await ShoppingCartModel.findOne({ cpf }).populate('items.product').exec()

  if (!shoppingCart) {
    // Cria o carrinho com nem um item
    shoppingCart = await ShoppingCartModel.create({ cpf, items: [] })
  }

  return res.status(200).json(shoppingCart)
})

// Adiciona um produto ao carrinho do usuario
router.post('/addProduct', async (req: Request, res: Response) => {
  const { cpf, productId: bodyProductId, quantity } = req.body

  // Verifica se o produto existe
  const product = await ProductModel.findById(bodyProductId).exec()

  if (!product) {
    throw new NotFoundError('Product not found')
  }

  // Verifica se tem algum carrinho com itens dentro
  const shoppingCart = await ShoppingCartModel.findOne({ cpf }).populate('items.productId').exec()

  if (!shoppingCart) {
    throw new NotFoundError('Shopping cart not found')
  }

  // Valida se ja existe o produto no carrinho
  const productIndex = shoppingCart.items.findIndex(item => item.productId.toString() === bodyProductId)

  if (productIndex === -1) {
    // Caso nao exista adicona no carrinho
    shoppingCart.items.push({ productId: bodyProductId, quantity: quantity })
  } else {
    // Caso exista soma mais 1 item no carrinho
    shoppingCart.items[productIndex].quantity += quantity
  }

  // Recalcula total do pedido
  shoppingCart.totalAmount = shoppingCart.items.reduce((total, item) => {
    return total + (ProductModel.findOne({ productId: bodyProductId }).get('price') || 0) * item.quantity
  }, 0)

  await shoppingCart.save()

  return res.status(200).json(shoppingCart)
})

// Atualiza a quantidade do produto no carrinho
router.patch('/updateQuantity', async (req: Request, res: Response) => {
  const { cpf, productId: bodyProductId, quantity } = req.body

  // Verifica se tem algum carrinho com itens dentro
  const shoppingCart = await ShoppingCartModel.findOne({ cpf }).populate('items.product').exec()

  if (!shoppingCart) {
    throw new NotFoundError('Shopping cart not found')
  }

  // Procura produto no carrinho
  const productIndex = shoppingCart.items.findIndex(item => item.productId.toString() === bodyProductId)

  if (productIndex !== -1) {
    // Atualiza quantidade no carrinho
    shoppingCart.items[productIndex].quantity = quantity

    // Recalcula total do pedido
    shoppingCart.totalAmount = shoppingCart.items.reduce((total, item) => {
      return total + (ProductModel.findOne({ productId: bodyProductId }).get('price') || 0) * item.quantity
    }, 0)

    await shoppingCart.save()
  }

  return res.status(200).json(shoppingCart)
})

// Remove produto do carrinho
router.patch('/removeProduct', async (req: Request, res: Response) => {
  const { cpf, productId: bodyProductId } = req.body

  // Verifica se tem algum carrinho com itens dentro
  const shoppingCart = await ShoppingCartModel.findOne({ cpf }).populate('items.product').exec()

  if (!shoppingCart) {
    throw new NotFoundError('Shopping cart not found')
  }

  // Procura produto no carrinho para remover
  shoppingCart.items = shoppingCart.items.filter(item => item.productId.toString() !== bodyProductId)

  // Validar se for o ultimo item do carrinho para nao passar pela logica abaixo
  // Todo

  // Recalcula total do pedido
  shoppingCart.totalAmount = shoppingCart.items.reduce((total, item) => {
    return total + (ProductModel.findOne({ productId: bodyProductId }).get('price') || 0) * item.quantity
  }, 0)

  await shoppingCart.save()

  return res.status(200).json(shoppingCart)
})

export default router
