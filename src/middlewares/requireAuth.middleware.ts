import { Request, Response, NextFunction } from 'express';
import { config } from '../config/index';
import { logger } from '../services/logger.service';
import { asyncLocalStorage } from '../services/als.service';

interface CustomRequest extends Request {
  loggedinUser?: any; // Define the type of loggedinUser property as any for now
}

export const requireAuth = (req: CustomRequest, res: Response, next: NextFunction) => {
  const { loggedinUser } = asyncLocalStorage.getStore() ?? {};
  req.loggedinUser = loggedinUser;

  if (!loggedinUser) {
    req.loggedinUser = { _id: '', fullname: 'Guest' };
    return next();
  }
  if (!loggedinUser) return res.status(401).send('Not Authenticated');
  next();
};

export const requireAdmin = (req: CustomRequest, res: Response, next: NextFunction) => {
  const { loggedinUser } = asyncLocalStorage.getStore() ?? {};
  if (!loggedinUser) return res.status(401).send('Not Authenticated');
  if (!loggedinUser.isAdmin) {
    logger.warn(loggedinUser.fullname + ' attempted to perform admin action');
    res.status(403).end('Not Authorized');
    return;
  }
  next();
};
