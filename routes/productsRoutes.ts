import express from 'express'

import { BadResquestError, NotFoundError } from '../utils/APIError'
import ProductModel from './models/productModel'

const router = express.Router()

interface FromatProduct {
  _id: string
  name: string
  description: string
  price: number
  category: number
}

//Consulta base de produtos
router.get('/', async (req, res) => {
  const products = await ProductModel.find()

  if (products.length == 0) {
    throw new NotFoundError('Nem um produto cadastrado')
  }

  const array: Array<FromatProduct> = new Array<FromatProduct>()
  products.forEach(element => {
    const { _id, name, description, price, category } = element
    const item: FromatProduct = {
      _id,
      name,
      description,
      price,
      category
    }
    array.push(item)
  })

  return res.status(200).json({ message: 'Rota de produtos', product: array })
})

//Consulta produto pelo id
router.get('/:id', async (req, res) => {
  const product = await ProductModel.find({ _id: req.params.id })

  if (product.length == 0) {
    throw new NotFoundError('Nem um produto cadastrado com id informado')
  } else if (product.length >= 2) {
    throw new BadResquestError('Mais de um produto cadastrado com id informado')
  }

  const array: Array<FromatProduct> = new Array<FromatProduct>()
  product.forEach(element => {
    const { _id, name, description, price, category } = element
    const item: FromatProduct = {
      _id,
      name,
      description,
      price,
      category
    }
    array.push(item)
  })

  return res.status(200).json({ message: `Detalhes do produto com ID ${req.params.id}`, product: array })
})

//Cadastra Produto
router.post('/', async (req, res) => {
  const { name, description, price, category } = req.body

  const product = await ProductModel.find({ name: name, price: price })

  if (product.length != 0) {
    throw new BadResquestError('Produto ja cadastrado')
  }
  //Categorias 1, 2 e 3
  // 1 - Notebook
  // 2 - Celular
  // 3 - Computador
  if (category != 1 && category != 2 && category != 3) {
    throw new NotFoundError('Category informada invalida.')
  }

  //Preço maximo e minimo
  if (price > 50000 || price < 10) {
    throw new BadResquestError('Price informado maior que 10k ou menor que 10 reais.')
  }

  if (description.length > 1024 || description.length < 10) {
    throw new BadResquestError('Description maior que 1024 ou menor que 10 caracteres.')
  }

  if (name > 225 || name < 5) {
    return new BadResquestError('Name maior que 1024 ou menor que 10 caracteres.')
  }

  const productModel = new ProductModel({
    name,
    description,
    price,
    category
  })

  productModel
    .save()
    .then(() => {
      return res.status(201).json({ message: 'Produto cadastrado com sucesso!' })
    })
    .catch(error => {
      throw new BadResquestError('Erro ao cadastrar produto:' + error)
    })
})

router.delete('/:id', async (req, res) => {
  const product = await ProductModel.find({ _id: req.params.id })

  if (product.length == 0) {
    throw new NotFoundError('Nenhum produto cadastrado com id informado')
  } else if (product.length >= 2) {
    throw new BadResquestError('Mais de um produto cadastrado com id informado')
  }

  await ProductModel.find({ _id: req.params.id }).deleteOne()

  return res.status(200).json({ message: 'Produto excluido com sucesso', product: product })
})

export default router
