import { model, Schema } from 'mongoose'

interface ProductImage extends Document {
  productId: string
  hash: string
  mimetype: string
}

const productImageSchema = new Schema<ProductImage>({
  productId: { type: String, required: true },
  hash: { type: String, required: true },
  mimetype: { type: String, required: true }
})

export const ProductImageModel = model<ProductImage>('ProductImage', productImageSchema)

export default ProductImageModel
