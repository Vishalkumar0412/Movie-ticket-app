import express from 'express'
import { authMiddleware } from '../middlewares/auth.middleware'
import { bookSeat, getMyBookings } from '../controllers/booking.controller'




const router=express.Router()
router.post('/book-seat',authMiddleware,bookSeat)
router.get('/my',authMiddleware,getMyBookings)

export default router