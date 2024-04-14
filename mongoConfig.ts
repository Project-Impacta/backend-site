import mongoose from 'mongoose'

import { MONGO_PASS, MONGO_STRING, MONGO_USER, NODE_ENV } from './enviroment'

const MONGO_URI =
  'mongodb+srv://gabrielcardosotavares:colocar_senha_aqui@impactastore.pb1hj7e.mongodb.net/local_impacta?retryWrites=true&w=majority&appName=ImpactaStore'

const connectToMongoDB = async () => {
  switch (NODE_ENV) {
    case 'local':
      console.log(MONGO_STRING, MONGO_USER)
      try {
        await mongoose.connect(MONGO_STRING, {
          user: MONGO_USER,
          pass: MONGO_PASS,
          connectTimeoutMS: 10000
        })
        console.log('Conectado ao MongoDB')
      } catch (error) {
        console.error('Erro ao conectar ao MongoDB:', error)
      }
      break
    case 'dev':
      // TODO QUANDO IMPLEMENTAR NA ESTEIRA TEM QUE VER COMO ACESSAR AS VARIAIVEIS DE AMBIENTE APARTIR DOQ FOI CADASTRADO NA ESTEIRA
      try {
        console.log(MONGO_STRING, MONGO_USER)
        await mongoose.connect(MONGO_STRING, {
          user: MONGO_USER,
          pass: MONGO_PASS,
          connectTimeoutMS: 10000
        })
        console.log('Conectado ao MongoDB Cloud dev')
      } catch (error) {
        console.error('Erro ao conectar ao MongoDB Cloud:', error)
      }
      break
    default:
      // TODO QUANDO IMPLEMENTAR NA ESTEIRA TEM QUE VER COMO ACESSAR AS VARIAIVEIS DE AMBIENTE APARTIR DOQ FOI CADASTRADO NA ESTEIRA
      try {
        console.log(MONGO_URI)
        await mongoose.connect(MONGO_URI)
        console.log('Conectado ao MongoDB Cloud default - sem senha')
      } catch (error) {
        console.error('Erro ao conectar ao MongoDB:', error)
      }
  }
}

export default connectToMongoDB
