import dotenv from 'dotenv'
import { resolve } from 'path'

export default dotenv.config({
  path: resolve(process.cwd(), '.env')
})
