import express from 'express'
import { getProfile, login, signup, logout } from '../controllers/user.controller'
import { authMiddleware } from '../middlewares/auth.middleware'
const router=express.Router()

router.post('/signup', signup)
router.post('/login', login)
router.get('/',authMiddleware, getProfile)
router.post('/logout',authMiddleware, logout)

export default router