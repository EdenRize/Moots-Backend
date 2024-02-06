import express from 'express'
import petController from './pet.controller'

export const petRouter = express.Router()

petRouter.get('/get/', petController.getPets)
petRouter.get('/get/:petId', petController.getPetById)
petRouter.post('/create', petController.addPet)
petRouter.patch('/update/:petId', petController.updatePet)
petRouter.delete('/delete/:petId', petController.removePet)
