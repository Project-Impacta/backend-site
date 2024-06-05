import './dotenv'

export enum ENV_VARS {
  LOCAL = 'local',
  DEV = 'develop',
  HOMOL = 'homol',
  PROD = 'prod',
  TEST = 'test'
}

export const NODE_ENV = process.env.NODE_ENV || ENV_VARS.LOCAL
export const PORT = process.env.PORT || 3333
export const MONGO_USER = process.env.MONGO_USER || 'root'
export const MONGO_PASS = process.env.MONGO_PASS || '123456'
export const MONGO_STRING = process.env.MONGO_STRING || 'mongodb://mongo_impacta:27017/local_impacta?authSource=admin'
export const JWT_PASS = process.env.JWT_PASS || '123456'
export const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || 'frontend'
export const FRONTEND_TOKEN = process.env.FRONTEND_TOKEN || '123456'
export const CORS_URL = process.env.CORS_URL || 'http://localhost:3000;https://localhost:3000'
