import { Request, Response } from 'express'
import { authService } from './auth.service'
import { logger } from '../../services/logger.service'
import {  User } from '../user/user.model'

export async function login(req: Request, res: Response): Promise<void> {
    const { username, password } = req.body
    try {
        const user = await authService.login(username, password)
        logger.info('User login: ', user)
        const loginToken = authService.getLoginToken(user)
        res.cookie('loginToken', loginToken, { sameSite: false, secure: true })

        res.json(user)
    } catch (err) {
        logger.error('Failed to Login ' + err)
        res.status(400).send({ err: 'Failed to Login' })
    }
}

export async function signup(req: Request, res: Response): Promise<void> {
    try {
        const credentials:User = req.body
        const account:User = await authService.signup(credentials)
        logger.debug(`auth.route - new account created: ` + JSON.stringify(account))

        const user = await authService.login(credentials.username, credentials.password)
        logger.info('User signup:', user)

        const loginToken = authService.getLoginToken(user)
        res.cookie('loginToken', loginToken, { sameSite: false, secure: true })

        res.json(user)
    } catch (err) {
        logger.error('Failed to signup ' + err)
        res.status(400).send({ err: 'Failed to signup', msg: err })
    }
}

export async function logout(req: Request, res: Response): Promise<void> {
    try {
        res.clearCookie('loginToken')
        res.send({ msg: 'Logged out successfully' })
    } catch (err) {
        res.status(400).send({ err: 'Failed to logout' })
    }
}
