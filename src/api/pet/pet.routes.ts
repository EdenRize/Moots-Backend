import express from 'express'
import { getPets, getPetById, addPet, updatePet, removePet } from './pet.controller'

const router = express.Router()

router.get('/', getPets)
router.get('/:petId', getPetById)
router.post('/', addPet)
router.put('/', updatePet)
router.delete('/:petId', removePet)

export const petRoutes = router