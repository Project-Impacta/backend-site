import mongoose from 'mongoose'

const MONGO_URI =
  'mongodb+srv://gabrielcardosotavares:colocar_senha_aqui@impactastore.pb1hj7e.mongodb.net/local_db?retryWrites=true&w=majority&appName=ImpactaStore'

const connectToMongoDB = async () => {
  try {
    await mongoose.connect(MONGO_URI)
    console.log('Conectado ao MongoDB')
  } catch (error) {
    console.error('Erro ao conectar ao MongoDB:', error)
  }
}

export default connectToMongoDB
