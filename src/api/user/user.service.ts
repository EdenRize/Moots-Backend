import { logger } from '../../services/logger.service'
import User from './user.model'

export const userService = {
    add,
    getById,
    update,
    remove,
    query,
    getByUsername
}

async function query(filterBy: any = {}): Promise<any[]> {
    try {
        const users = await User.find(buildQuery(filterBy))
        return users
    } catch (err) {
        logger.error('cannot find users', err)
        throw err
    }
}

async function getById(userId: string): Promise<any> {
    try {
        const user = await User.findById(userId)
        return user
    } catch (err) {
        logger.error(`while finding user by id: ${userId}`, err)
        throw err
    }
}

async function getByUsername(username: string): Promise<any> {
    try {
        const user = await User.findOne({ username })
        return user
    } catch (err) {
        logger.error(`while finding user by username: ${username}`, err)
        throw err
    }
}

async function remove(userId: string): Promise<void> {
    try {
        await User.findByIdAndDelete(userId)
    } catch (err) {
        logger.error(`cannot remove user ${userId}`, err)
        throw err
    }
}

async function update(user: any): Promise<any> {
    try {
        const updatedUser = await User.findByIdAndUpdate(user._id, user, { new: true })
        return updatedUser
    } catch (err) {
        logger.error(`cannot update user ${user._id}`, err)
        throw err
    }
}

async function add(user: any): Promise<any> {
    try {
        const newUser = new User(user)
        await newUser.save()
        return newUser
    } catch (err) {
        logger.error('cannot add user', err)
        throw err
    }
}


function buildQuery(filterBy: any): any {
    const query: any = {}
    if (filterBy.txt) {
        const regex = new RegExp(filterBy.txt, 'i')
        query.$or = [
            { username: regex }
        ]
    }
    return query
}
