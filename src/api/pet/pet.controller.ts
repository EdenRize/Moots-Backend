import { NextFunction, Request, Response } from 'express'
import { logger } from '../../services/logger.service'
import { petService } from './pet.service'
import { Pet } from './pet.model'
import { asyncLocalStorage } from '../../services/als.service'
import { addPetToUser } from '../user/user.controller'

export async function addPet (req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
      const { loggedinUser } = asyncLocalStorage.getStore()

    const { 
      type,
      name,
      age,
      description,
      imgs,
      race
     } = req.body
  
    const petToAdd:Pet = {
      ownerId: loggedinUser._id,
      createdAt: Date.now(),
      type,
      name,
      age,
      description,
      imgs,
      race
    }

    const addedPet:Pet = await petService.add(petToAdd)

    if(addedPet._id) {
      await addPetToUser(addedPet.ownerId, addedPet._id)
    }
    
    logger.debug(`Added pet: [${addedPet._id}]`)
    res.status(201).send({ pet: addedPet })
  } catch (err) {
    logger.error(err)
    res.status(500).send({ err })
  }
}

export async function getPetById(req: Request, res: Response): Promise<void> {
  try {
    const {petId} = req.params
    const foundPet = await petService.getById(petId)

    if (foundPet) {
      res.status(200).send({ pet: foundPet })
    } else {
      res.status(404).send({ message: 'Pet not found', petId: petId })
    }

  } catch (err) {
    console.error(err)
    res.status(500).send({ err: 'Internal server error' })
  }
}


export async function getPets (req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const pets = await petService.query(req.query)
    res.send(pets)
  } catch (err) {
    logger.error(err)
    res.status(500).send({ err })
  }
}

export async function updatePet (req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { 
      _id,
      ownerId,
      type,
      createdAt,
      name,
      age,
      description,
      imgs,
      race
     } = req.body
  
    const petToUpdate:Pet = {
      _id,
      ownerId,
      type,
      createdAt,
      name,
      age,
      description,
      imgs,
      race
    }

    const updatedPet = await petService.update(petToUpdate)
    res.send(updatedPet)
  } catch (err) {
    logger.error(err)
    res.status(500).send({ err })
  }
}

export async function removePet(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const petId = req.params.petId
    const removedPet = await petService.remove(petId)

    if (removedPet) {
      logger.debug(`Removed pet: [${petId}]`)
      res.status(201).send({ message: 'Removed', petId: petId })
    } else {
      logger.error(`Failed to delete, pet not found: [${petId}]`)
      res.status(404).send({ message: 'Not found', petId: petId })
    }

  } catch (err) {
    logger.error(err)
    res.status(500).send({ err })
  }
}

