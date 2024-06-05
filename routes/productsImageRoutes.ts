import express from 'express'
import fs from 'fs'
import { isObjectIdOrHexString } from 'mongoose'
import path from 'path'

import { BadResquestError, NotFoundError } from '../utils/APIError'
import ProductImageModel from './models/productImageModel'
import ProductModel from './models/productModel'
import { createHash } from 'crypto';

const router = express.Router()

function calculateHash(filepath: string): string {
  const hasher = createHash('sha256');
  const fileBuffer = fs.readFileSync(filepath);
  hasher.update(fileBuffer);
  return hasher.digest('hex');
}

// Cadastra hash da imagem
router.post('/', async (req, res) => {
  const file = req.file
  if (!file) {
    throw new BadResquestError('Nem um arquivo enviado para o cadastro.')
  }
  const hashFile = calculateHash(file!.path)
  const mimetype = file.mimetype
  fs.unlinkSync(file.path)
  if (!isObjectIdOrHexString(req.body.productId)) {
    throw new BadResquestError('Formato do productId invalido')
  }
  const product = await ProductModel.find({ _id: req.body.productId })
  if (product.length == 0) {
    throw new NotFoundError('Nem um produto cadastrado com id informado')
  }
  const productImage = await ProductImageModel.find({ productId: req.body.productId })
  if (productImage.length > 0) {
    throw new BadResquestError('ProductId ja tem uma imagem, exclua a antiga e tente novamente.')
  }
  const newImage = new ProductImageModel({
    productId: req.body.productId,
    hash: hashFile,
    mimetype: mimetype
  })
  newImage
    .save()
    .then(() => {
      return res.status(201).json(newImage)
    })
    .catch(error => {
      throw new BadResquestError('Erro ao cadastrar imagem:' + error)
    })
})

// Consulta imagem pelo id do produto
router.get('/:id', async (req, res) => {
  const { id } = req.params

  const image = await ProductImageModel.find({ productId: id })
  console.log('image->',image)
  if (image.length == 0) {
    throw new NotFoundError('Imagem nao encontrada com o id informado.')
  }

  return res.json({hash: image[0].hash})
})

// Consulta todas imagens
router.get('/', async (req, res) => {
  const find = await ProductImageModel.find()
  if (find.length == 0) {
    throw new NotFoundError('Nao tem imagens cadastradas.')
  }

  return res.json({ data: [find] })
})

// Deleta hash da imagem do banco
router.delete('/', async (req, res) => {
  const { productId } = req.body
  const find = await ProductImageModel.find()
  if (find.length == 0) {
    throw new NotFoundError('Nao tem imagens cadastradas.')
  }
  if (productId) {
    const image = await ProductImageModel.find({ productId: productId })
    if (!image) {
      throw new NotFoundError('Imagem nao encontrada com o id informado.')
    }
    await image[0].deleteOne()
    return res.json({ message: 'Arquivo removido' })
  }
  throw new BadResquestError('Erro de requisicao, analise e tente novamente.')
})

export default router
