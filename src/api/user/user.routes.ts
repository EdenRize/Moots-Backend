import express from 'express'
import { requireAuth, requireAdmin } from '../../middlewares/requireAuth.middleware'
import { getUser, getUsers, deleteUser, updateUser } from './user.controller'

const router = express.Router()

router.get('/', getUsers)
router.get('/:id', getUser)
router.put('/:id', requireAuth, updateUser)
router.delete('/:id', requireAuth, requireAdmin, deleteUser)

export const userRoutes = router
