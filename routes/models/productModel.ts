import mongoose, { Document, Schema } from 'mongoose'

interface Product extends Document {
  productId: number
  name: string
  description: string
  price: number
  category: string
}

const productSchema = new Schema<Product>({
  productId: { type: Number, unique: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, required: true }
})

const ProductModel = mongoose.model<Product>('Produtc', productSchema)

export default ProductModel
