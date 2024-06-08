import { Request, Response } from 'express'

import { APIError } from '../utils/APIError'

export const errorMiddleware = (error: Error & Partial<APIError>, req: Request, res: Response) => {
  const statusCode = error.statusCode ?? 500
  const message = error.statusCode ? error.message : 'Internal Server Error'
  return res.status(statusCode).json({ message })
}
