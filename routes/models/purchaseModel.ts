import mongoose, { Document, Schema } from 'mongoose'

interface PurchaseItem {
  product: string // Product ID
  quantity: number
}

interface Purchase extends Document {
  purchaseId: number // Custom incremental ID
  client: string // CPF Client
  items: PurchaseItem[]
  totalAmount: number
}

const purchaseSchema = new Schema<Purchase>({
  purchaseId: { type: Number, unique: true },
  client: { type: String, ref: 'Client', required: true },
  items: [
    {
      product: { type: Number, ref: 'Product', required: true },
      quantity: { type: Number, required: true }
    }
  ],
  totalAmount: { type: Number, required: true }
})

const PurchaseModel = mongoose.model<Purchase>('Purchase', purchaseSchema)

export default PurchaseModel
