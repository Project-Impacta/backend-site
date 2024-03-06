import express from 'express'

import ProductModel from './models/productModel'

const router = express.Router()

//Consulta base de produtos
router.get('/', (req, res) => {
  res.send('Rota de produtos')
})

//Consulta produto pelo id
router.get('/:id', (req, res) => {
  const userId = req.params.id
  res.send(`Detalhes do usuário com ID ${userId}`)
})

//Cadastra Produto
router.post('/', (req, res) => {
  const productModel = new ProductModel({
    name: req.body.name,
    description: req.body.description,
    price: req.body.price,
    category: req.body.category
  })

  productModel
    .save()
    .then(() => {
      res.send('Produto cadastrado com sucesso!')
    })
    .catch(error => {
      res.status(400)
      res.send('Erro ao cadastrar cliente:' + error)
    })
})

export default router
