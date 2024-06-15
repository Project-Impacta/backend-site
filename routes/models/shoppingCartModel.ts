import mongoose, { Document, Schema } from 'mongoose'

//SCHEMA OBSOLETO

interface CartItens {
  productId: string // ID do produto
  quantity: number
}

interface ShoppingCart extends Document {
  client: string // CPF do cliente
  items: CartItens[]
  totalAmount: number
}

const shoppingCartSchema = new Schema<ShoppingCart>({
  client: { type: String, required: true, unique: true },
  items: [
    {
      productId: { type: Number, ref: 'Product', required: true },
      quantity: { type: Number, default: 1 }
    }
  ]
})

const ShoppingCartModel = mongoose.model<ShoppingCart>('ShoppingCart', shoppingCartSchema)

export default ShoppingCartModel
