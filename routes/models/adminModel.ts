import mongoose, { Document, Schema } from 'mongoose'

interface Admin extends Document {
  cpf: string
  name: string
  password: string
}

const adminSchema = new Schema<Admin>({
  cpf: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  password: { type: String, required: true }
})

const AdminModel = mongoose.model<Admin>('Admin', adminSchema)

export default AdminModel
