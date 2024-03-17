import './dotenv'

export enum ENV_VARS {
  LOCAL = 'local',
  DEV = 'develop',
  HOMOL = 'homol',
  PROD = 'prod',
  TEST = 'test'
}

export const NODE_ENV = process.env.NODE_ENV || ENV_VARS.LOCAL
export const MONGO_USER = process.env.MONGO_USER || 'root'
export const MONGO_PASS = process.env.MONGO_PASS || '123456'
export const MONGO_STRING = process.env.MONGO_STRING || 'mongodb://mongo_impacta:27017/local_impacta?authSource=admin'
