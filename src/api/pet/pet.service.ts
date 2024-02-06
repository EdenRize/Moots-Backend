import { logger } from '../../services/logger.service'
import Pet from './pet.model'
import mongoose from 'mongoose'


export const petService = {
    add,
    getById,
    query,
    update,
    remove,
}

async function add(pet: any): Promise<any> {
    try {
        const newPet = new Pet(pet)
        await newPet.save()
        return newPet
    } catch (err) {
        logger.error('cannot add pet', err)
        throw err
    }
}

async function getById(petId: string): Promise<any> {
  try {
    const foundPet = await Pet.findById(petId)
    return foundPet
  } catch (err) {
    console.error(err)
    throw new Error('Failed to find pet')
  }
}

async function query (filterBy: any = {}) {
  try {
    const pets = await Pet.find(buildQuery(filterBy))
    return pets
  } catch (err) {
    console.error(err)
    throw new Error('Failed to find pets')
  }
}

async function update(pet: any): Promise<any> {
    try {
        const updatedPet = await Pet.findByIdAndUpdate(
            mongoose.Types.ObjectId.createFromHexString(pet._id),
            pet,
            { new: true }
        )
        return updatedPet
    } catch (err) {
        logger.error(`cannot update pet ${pet._id}`, err)
        throw err
    }
}

export async function remove(petId: string): Promise<boolean> {
  try {
    const removedPet = await Pet.findByIdAndDelete(petId)
    return !!removedPet
  } catch (err) {
    logger.error(`cannot remove pet ${petId}`, err)
    throw err
  }
}

function buildQuery(filterBy: any): any {
    const query: any = {}

    if (filterBy.txt) {
        const regex = new RegExp(filterBy.txt, 'i')
        query.$or = [
            { name: regex },
            { type: regex },
        ]
    }

    if (filterBy.type) {
        query.type = { $gte: filterBy.type }
    }

    if (filterBy.race) {
        query.race = { $gte: filterBy.race }
    }

   if (filterBy.minAge || filterBy.maxAge) {
        query.age = {}

        if (filterBy.minAge) {
            query.age.$gte = filterBy.minAge
        }

        if (filterBy.maxAge) {
            query.age.$lte = filterBy.maxAge
        }
    }

    return query
}