import { config } from 'dotenv'
import express from 'express'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import router from './routes/index.routes'
import env from './config/env'
config()
const app = express()
app.use(express.json())
app.use(cookieParser())

// Use official cors middleware
app.use(cors({
  origin: process.env.FRONTEND_ORIGIN || '*',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization'],
}))

app.use('/api/v1', router)

export default app
