import Cryptr from 'cryptr'
import bcrypt from 'bcrypt'
import { Request } from 'express' // Assuming you might need this for type annotations in future
import { userService } from '../user/user.service'
import { logger } from '../../services/logger.service'
import { User } from '../user/user.model'

// const cryptr = new Cryptr(process.env.CRYPTR_SECRET)
const cryptr = new Cryptr(process.env.CRYPTR_SECRET || 'Secret-myday-1801')

export const authService = {
    signup,
    login,
    getLoginToken,
    validateToken
}

async function login(username: string, password: string):Promise<User> {
    try {
        logger.debug(`auth.service - login with username: ${username}`)
    
        const user = await userService.getByUsername(username)
        if (!user) throw new Error('Invalid username or password')
        
        const match = await bcrypt.compare(password, user.password)
        if (!match) throw new Error('Invalid username or password')
    
        delete user.password
        user._id = user._id.toString()
        return user  
    } catch (err) {
        logger.error('cannot login', err)
        throw err
    }
}

async function signup(user:User):Promise<User> {
    try {
        const saltRounds = 10
    
        logger.debug(`auth.service - signup with username: ${user.username}`)
        if (!user.username || !user.password) throw new Error('Missing required signup information')
    
        const userExist = await userService.getByUsername(user.username)
        if (userExist) throw new Error('Username already taken')
    
        const hash = await bcrypt.hash(user.password, saltRounds)
        return userService.add({ username:user.username, password: hash, avatar:user.avatar, pets:user.pets })
    } catch (err) {
        logger.error('cannot sign up', err)
        throw err
    }
}

function getLoginToken(user:User) {
    const userInfo = { _id: user._id, username: user.username, avatar: user.avatar }
    return cryptr.encrypt(JSON.stringify(userInfo))
}

function validateToken(loginToken: string) {
    try {
        const json = cryptr.decrypt(loginToken)
        const loggedinUser = JSON.parse(json)
        return loggedinUser
    } catch (err) {
        console.log('Invalid login token')
    }
}
