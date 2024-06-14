import multer from 'multer'
import path from 'path'

import { BadResquestError } from '../utils/APIError'

// Configuração do armazenamento
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/')
  },
  filename: (req, file, cb) => {
    // Pega o identificador do produto da requisição
    const productId = req.body.productId
    if (!productId) {
      return cb(new BadResquestError('Product ID is required'), '')
    }
    // Extrai a extensão do arquivo
    const extension = path.extname(file.originalname)
    // Forma o nome do arquivo usando o productId e a extensão original do arquivo
    cb(null, `${productId}${extension}`)
  }
})

// Filtro para validar os tipos de arquivo
const fileFilter = (req: Express.Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedMimeTypes = ['image/webp']
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true)
  } else {
    cb(new BadResquestError('Invalid file type. Only Webp is allowed.'))
  }
}

// Configuração do multer
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // Limite de 5MB por arquivo
  }
})

export default upload
