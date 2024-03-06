import mongoose, { Document, Schema } from 'mongoose'

interface Client extends Document {
  cpf: string
  name: string
  email: string
  password: string
}

const clientSchema = new Schema<Client>({
  cpf: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
})

const ClientModel = mongoose.model<Client>('Client', clientSchema)

export default ClientModel
