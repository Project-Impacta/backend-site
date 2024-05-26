import express from 'express'
import fs from 'fs'
import { isObjectIdOrHexString } from 'mongoose'
import path from 'path'

import { BadResquestError, NotFoundError } from '../utils/APIError'
import ProductImageModel from './models/productImageModel'
import ProductModel from './models/productModel'

const router = express.Router()

router.post('/', async (req, res) => {
  const file = req.file
  if (!file) {
    throw new BadResquestError('No file uploaded.')
  }
  if (!isObjectIdOrHexString(req.body.productId)) {
    throw new BadResquestError('Format of productId invalid')
  }
  const product = await ProductModel.find({ _id: req.body.productId })
  if (product.length == 0) {
    fs.unlinkSync(file.path)
    throw new NotFoundError('Nem um produto cadastrado com id informado')
  }
  const productImage = await ProductImageModel.find({ productId: req.body.productId })
  if (productImage.length > 0) {
    throw new BadResquestError('ProductId informed already have image, exclude old and try again.')
  }
  const newImage = new ProductImageModel({
    productId: req.body.productId,
    path: file!.path
  })
  newImage
    .save()
    .then(() => {
      return res.status(201).json(newImage)
    })
    .catch(error => {
      fs.unlinkSync(file.path)
      throw new BadResquestError('Erro ao cadastrar cliente:' + error)
    })
})

router.get('/:id', async (req, res) => {
  const { id } = req.params

  const image = await ProductImageModel.find({ productId: id })
  if (!image) {
    throw new NotFoundError('Image not found.')
  }

  return res.sendFile(path.resolve(image[0].path))
})

router.get('/', async (req, res) => {
  const find = await ProductImageModel.find()
  if (find.length == 0) {
    throw new NotFoundError('No has images on collection.')
  }

  return res.json({ data: [find] })
})

router.delete('/', async (req, res) => {
  const { productId } = req.body
  const find = await ProductImageModel.find()
  if (find.length == 0) {
    throw new NotFoundError('No has images on collection.')
  }
  if (productId) {
    const image = await ProductImageModel.find({ productId: productId })
    if (!image) {
      throw new NotFoundError('No has image by productId on collection.')
    }
    fs.unlinkSync(image[0].path)
    await image[0].deleteOne()
    return res.json({ message: 'File is removed' })
  }
  throw new BadResquestError('Bad request return, analyse and try again.')
})

export default router
