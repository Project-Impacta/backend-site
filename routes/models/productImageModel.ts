import { model, Schema } from 'mongoose'

interface ProductImage extends Document {
  productId: string
  path: string
}

const productImageSchema = new Schema<ProductImage>({
  productId: { type: String, required: true },
  path: { type: String, required: true }
})

export const ProductImageModel = model<ProductImage>('ProductImage', productImageSchema)

export default ProductImageModel
