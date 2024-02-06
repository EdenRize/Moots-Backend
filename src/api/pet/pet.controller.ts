import { NextFunction, Request, Response } from 'express'
import mongoose from 'mongoose'
import Pet from './pet.model'
import { loggerService } from '../../services/logger.service'

const addPet = async (req: Request, res: Response, next: NextFunction) => {
  const { 
    ownerId,
    type,
    name,
    age,
    description,
    imgs,
    race
   } = req.body
  const petToAdd = new Pet({
    // _id: new mongoose.Types.ObjectId(),
    ownerId,
    type,
    name,
    age,
    description,
    imgs,
    race
  })
  try {
    const addedPet = await petToAdd.save()
    loggerService.debug(`Added pet: [${addedPet._id}]`)
    return res.status(201).send({ pet: addedPet })
  } catch (err) {
    loggerService.error(err)
    return res.status(500).send({ err })
  }
}

const getPetById = async (req: Request, res: Response, next: NextFunction) => {
  const petId = req.params.petId

  try {
    const foundPet = await Pet.findById(petId)
    if (foundPet) {
      loggerService.debug(`Found pet: [${foundPet._id}]`)
      return res.status(200).send({ pet: foundPet })
    } else {
      loggerService.error(`Failed to find: [${petId}]`)
      return res.status(404).send({ message: 'Pet not found', petId: petId })
    }
  } catch (err) {
    loggerService.error(err)
    return res.status(500).send({ err })
  }
}

const getPets = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const pets = await Pet.find()
    loggerService.debug(`Found [${pets.length}] pets`)
    return res.status(200).send({ pets })
  } catch (err) {
    loggerService.error(err)
    return res.status(500).send({ err })
  }
}

const updatePet = async (req: Request, res: Response, next: NextFunction) => {
  const petId = req.params.petId

  try {
    const pet = await Pet.findById(petId)
    if (pet) {
      pet.set(req.body)
      const updatedPet = await pet.save()
      loggerService.debug(`Updated pet: [${updatedPet._id}]`)
      return res.status(200).send({ pet: updatedPet })
    } else {
      loggerService.error(`Failed to update, pet not found: [${petId}] `)
      return res.status(404).send({ message: 'Not found', petId: petId })
    }
  } catch (err) {
    loggerService.error(err)
    return res.status(500).send({ err })
  }
}

const removePet = async (req: Request, res: Response, next: NextFunction) => {
  const petId = req.params.petId

  try {
    const deletedPet = await Pet.findByIdAndDelete(petId)
    if (deletedPet) {
      loggerService.debug(`Deleted pet: [${deletedPet._id}]`)
      return res.status(201).send({ message: 'Deleted', petId: petId })
    } else {
      loggerService.error(`Failed to delete, pet not found: [${petId}]`)
      return res.status(404).send({ message: 'Not found', petId: petId })
    }
  } catch (err) {
    loggerService.error(err)
    return res.status(500).send({ err })
  }
}

export default { addPet, getPetById, getPets, updatePet, removePet }