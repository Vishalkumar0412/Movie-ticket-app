import express from 'express'

import { authMiddleware } from '../middlewares/auth.middleware'
import { addMovie, addShowTime, addTheater } from '../controllers/admin.controller'
import { roleMiddleware } from '../middlewares/role.middleware'

const router=express.Router()
router.post('/add-movie',authMiddleware,roleMiddleware("ADMIN") ,addMovie)
router.post('/add-show',authMiddleware,roleMiddleware("ADMIN") ,addShowTime)
router.post('/add-theater',authMiddleware,roleMiddleware("ADMIN") ,addTheater)

export default router