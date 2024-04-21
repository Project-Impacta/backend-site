import { NextFunction, Request, Response } from 'express'

import { FRONTEND_ORIGIN, FRONTEND_TOKEN } from '../enviroment'
import { UnauthorizedError } from '../utils/APIError'

export const authFrontend = async (req: Request, res: Response, next: NextFunction) => {
  const { secret_origin, token } = req.headers
  if (secret_origin != FRONTEND_ORIGIN || token != FRONTEND_TOKEN) {
    throw new UnauthorizedError('Nao autorizado')
  }
  next()
}
