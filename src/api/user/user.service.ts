import { logger } from '../../services/logger.service'
import UserModel, { User } from './user.model'

export const userService = {
    add,
    query,
    getById,
    getByUsername,
    remove,
    update,
    addPetToUser,
}

async function add(user:User): Promise<User> {
    try {
        const newUser = new UserModel(user)
        await newUser.save()
        return newUser
    } catch (err) {
        logger.error('cannot add user', err)
        throw err
    }
}

async function query(filterBy: {[key:string]:any} = {}): Promise<User[]>  {
    try {
        const users = await UserModel.find(buildQuery(filterBy))
        return users
    } catch (err) {
        logger.error('cannot find users', err)
        throw err
    }
}

async function getById(userId: string): Promise<User | null> {
    try {
        const user = await UserModel.findById(userId)
        return user
    } catch (err) {
        logger.error(`while finding user by id: ${userId}`, err)
        throw err
    }
}

async function getByUsername(username: string): Promise<User | null> {
    try {
        const user = await UserModel.findOne({ username })
        return user
    } catch (err) {
        logger.error(`while finding user by username: ${username}`, err)
        throw err
    }
}

async function remove(userId: string): Promise<void> {
    try {
        await UserModel.findByIdAndDelete(userId)
    } catch (err) {
        logger.error(`cannot remove user ${userId}`, err)
        throw err
    }
}

async function update(user: User): Promise<User | null> {
    try {
        const updatedUser = await UserModel.findByIdAndUpdate(user._id, user, { new: true })
        return updatedUser
    } catch (err) {
        logger.error(`cannot update user ${user._id}`, err)
        throw err
    }
}

async function addPetToUser(userId: string, petId: string): Promise<User | null> {
    try {
        const user = await UserModel.findById(userId);
        if (!user) {
            throw new Error('User not found');
        }
        if(!user.pets) user.pets = []
        user.pets.unshift(petId); // Add the new petId to the beginning of the pets array
        const updatedUser = await user.save();
        return updatedUser;
    } catch (err) {
        logger.error(`Cannot add pet to user ${userId}`, err);
        throw err;
    }
}


function buildQuery(filterBy: {[key:string]:any}): any {
    const query: any = {}
    if (filterBy.txt) {
        const regex = new RegExp(filterBy.txt, 'i')
        query.$or = [
            { username: regex }
        ]
    }
    return query
}
