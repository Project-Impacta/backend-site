import express from 'express'
import fs from 'fs'
import { isObjectIdOrHexString } from 'mongoose'

import { BadResquestError, NotFoundError } from '../utils/APIError'
import ProductImageModel from './models/productImageModel'
import ProductModel from './models/productModel'

const router = express.Router()

function fileToBase64(filepath: string): string {
  const filePath = filepath
  const fileBuffer = fs.readFileSync(filePath)
  const base64Encoded = fileBuffer.toString('base64')
  fs.unlinkSync(filePath) // Remove o arquivo temporário
  return base64Encoded
}

// Cadastra hash da imagem
router.post('/', async (req, res) => {
  const file = req.file
  if (!file) {
    throw new BadResquestError('Nem um arquivo enviado para o cadastro.')
  }
  const mimetype = file.mimetype
  const hashFile = fileToBase64(file!.path)
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
// Backend: Ajustar a rota de consulta de imagem
router.get('/:id', async (req, res) => {
  const { id } = req.params

  const image = await ProductImageModel.find({ productId: id })
  if (image.length == 0) {
    throw new NotFoundError('Imagem não encontrada com o id informado.')
  }

  return res.json(image[0])
})

// Consulta todas imagens
// Backend: Ajustar a rota de consulta de todas as imagens
router.get('/', async (req, res) => {
  const find = await ProductImageModel.find()
  if (find.length == 0) {
    throw new NotFoundError('Não tem imagens cadastradas.')
  }

  return res.json({ data: find })
})
// Deleta hash da imagem do banco
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params
    const find = await ProductImageModel.find()
    if (find.length === 0) {
      return res.status(404).json({ message: 'Nao tem imagens cadastradas.' })
    }

    const image = await ProductImageModel.findOne({ _id: id })
    if (!image) {
      return res.status(404).json({ message: 'Imagem nao encontrada com o id informado.' })
    }

    await image.deleteOne()
    return res.json({ message: 'Arquivo removido' })
  } catch (error) {
    return res.status(500).json({ message: 'Erro ao excluir imagem', error })
  }
})

export default router
