import Cryptr from 'cryptr'
import bcrypt from 'bcrypt'
import { Request } from 'express' // Assuming you might need this for type annotations in future
import { userService } from '../user/user.service'
import { logger } from '../../services/logger.service'

// const cryptr = new Cryptr(process.env.CRYPTR_SECRET)
const cryptr = new Cryptr(process.env.CRYPTR_SECRET || 'Secret-myday-1801')

export const authService = {
    signup,
    login,
    getLoginToken,
    validateToken
}

async function login(username: string, password: string) {
    logger.debug(`auth.service - login with username: ${username}`)

    const user = await userService.getByUsername(username)
    if (!user) throw new Error('Invalid username or password')
    // TODO: un-comment for real login
    const match = await bcrypt.compare(password, user.password)
    if (!match) throw new Error('Invalid username or password')

    delete user.password
    user._id = user._id.toString()
    return user
}

async function signup({ username, password, fullname, imgUrl }: { username: string, password: string, fullname: string, imgUrl: string }) {
    const saltRounds = 10

    logger.debug(`auth.service - signup with username: ${username}, fullname: ${fullname}`)
    if (!username || !password || !fullname) throw new Error('Missing required signup information')

    const userExist = await userService.getByUsername(username)
    if (userExist) throw new Error('Username already taken')

    const hash = await bcrypt.hash(password, saltRounds)
    return userService.add({ username, password: hash, fullname, imgUrl })
}

function getLoginToken(user: { _id: string, fullname: string, imgUrl: string }) {
    const userInfo = { _id: user._id, fullname: user.fullname, imgUrl: user.imgUrl }
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
    return null
}
