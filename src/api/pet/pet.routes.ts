import express from 'express'
import { getPets, getPetById, addPet, updatePet, removePet } from './pet.controller'

export const petRouter = express.Router()

petRouter.get('/get/', getPets)
petRouter.get('/get/:petId', getPetById)
petRouter.post('/create', addPet)
petRouter.patch('/update/:petId', updatePet)
petRouter.delete('/delete/:petId', removePet)
