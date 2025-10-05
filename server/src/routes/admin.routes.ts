import express from 'express'

import { authMiddleware } from '../middlewares/auth.middleware'
import { addMovie, addShowTime, addTheater, uploadMedia } from '../controllers/admin.controller'
import { roleMiddleware } from '../middlewares/role.middleware'
import { upload } from '../middlewares/multer'

const router=express.Router()
router.post('/add-movie',authMiddleware,roleMiddleware("ADMIN") ,addMovie)
router.post('/add-show',authMiddleware,roleMiddleware("ADMIN") ,addShowTime)
router.post('/add-theater',authMiddleware,roleMiddleware("ADMIN") ,addTheater)
router.post('/upload',authMiddleware,roleMiddleware("ADMIN"), upload.single('file'), uploadMedia)

export default router