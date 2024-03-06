import express, { Request, Response } from 'express'

import ProductModel from './models/productModel'
import ShoppingCartModel from './models/shoppingCartModel'

const router = express.Router()

// Cria um carrinho para o usuario
router.post('/', async (req: Request, res: Response) => {
  try {
    const { clientId } = req.body

    // Verifica se tem algum carrinho com itens dentro
    let shoppingCart = await ShoppingCartModel.findOne({ client: clientId }).populate('items.product').exec()

    if (!shoppingCart) {
      // Cria o carrinho com nem um item
      shoppingCart = await ShoppingCartModel.create({ client: clientId, items: [] })
    }

    res.status(200).json(shoppingCart)
  } catch (error) {
    console.error('Error creating/returning shopping cart:', error)
    res.status(500).send('Internal Server Error')
  }
})

// Add a product to the shopping cart
router.post('/addProduct', async (req: Request, res: Response) => {
  try {
    const { clientId, productId: bodyProductId, quantity } = req.body

    // Verifica se o produto existe
    const product = await ProductModel.findById(bodyProductId).exec()

    if (!product) {
      return res.status(404).send('Product not found')
    }

    // Verifica se tem algum carrinho com itens dentro
    const shoppingCart = await ShoppingCartModel.findOne({ client: clientId }).populate('items.productId').exec()

    if (!shoppingCart) {
      return res.status(404).send('Shopping cart not found')
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

    res.status(200).json(shoppingCart)
  } catch (error) {
    console.error('Error adding product to shopping cart:', error)
    res.status(500).send('Internal Server Error')
  }
})

// Atualiza a quantidade do produto no carrinho
router.patch('/updateQuantity', async (req: Request, res: Response) => {
  try {
    const { clientId, productId: bodyProductId, quantity } = req.body

    // Verifica se tem algum carrinho com itens dentro
    const shoppingCart = await ShoppingCartModel.findOne({ client: clientId }).populate('items.product').exec()

    if (!shoppingCart) {
      return res.status(404).send('Shopping cart not found')
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

    res.status(200).json(shoppingCart)
  } catch (error) {
    console.error('Error updating quantity in shopping cart:', error)
    res.status(500).send('Internal Server Error')
  }
})

// Remove produto do carrinho
router.patch('/removeProduct', async (req: Request, res: Response) => {
  try {
    const { clientId, productId: bodyProductId } = req.body

    // Verifica se tem algum carrinho com itens dentro
    const shoppingCart = await ShoppingCartModel.findOne({ client: clientId }).populate('items.product').exec()

    if (!shoppingCart) {
      return res.status(404).send('Shopping cart not found')
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

    res.status(200).json(shoppingCart)
  } catch (error) {
    console.error('Error removeProduct in shopping cart:', error)
    res.status(500).send('Internal Server Error')
  }
})

export default router
