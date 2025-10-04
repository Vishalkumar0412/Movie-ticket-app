import express from 'express'
import { authMiddleware } from '../middlewares/auth.middleware'
import { checkMovies } from '../controllers/movie.controller'



const router=express.Router()

router.get('/fetch-movies',authMiddleware, checkMovies)
export default router