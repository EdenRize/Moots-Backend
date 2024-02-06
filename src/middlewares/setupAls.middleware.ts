import { Request, Response, NextFunction } from 'express'
import { authService } from '../api/auth/auth.service'
import { asyncLocalStorage } from '../services/als.service'

export async function setupAsyncLocalStorage(req: Request, res: Response, next: NextFunction): Promise<void> {
  const storage: any = {}

  asyncLocalStorage.run(storage, () => {
    if (!req.cookies) return next()
    const loggedinUser = authService.validateToken(req.cookies.loginToken)

    if (loggedinUser) {
      const alsStore = asyncLocalStorage.getStore()
      alsStore.loggedinUser = loggedinUser
    }

    next()
  })
}
