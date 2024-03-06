import mongoose from 'mongoose'

// const MONGO_URI = 'mongodb://root:123456@localhost:27017/local_db?authSource=admin&readPreference=primary&directConnection=true&ssl=false'

const connectToMongoDB = async () => {
  try {
    await mongoose.connect(`mongodb://mongo_impacta:27017/local_db?authSource=admin`, {
      user: 'root',
      pass: '123456',
      connectTimeoutMS: 10000
    })
    console.log('Conectado ao MongoDB')
  } catch (error) {
    console.error('Erro ao conectar ao MongoDB:', error)
  }
}

export default connectToMongoDB
