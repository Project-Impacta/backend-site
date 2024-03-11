import mongoose, { Document, Schema } from 'mongoose'

interface Client extends Document {
  cpf: string
  firstName: string
  lastName: string
  email: string
  password: string
  phone: string
}

const clientSchema = new Schema<Client>({
  cpf: { type: String, required: true, unique: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String, required: true }
})

const ClientModel = mongoose.model<Client>('Client', clientSchema)

export default ClientModel
