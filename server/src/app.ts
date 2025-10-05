import {config} from 'dotenv'
import express from 'express'
import cookieParser from 'cookie-parser'
import router from './routes/index.routes'
import env from './config/env'
config()
const app=express()
app.use(express.json())
app.use(cookieParser())

// Minimal CORS to support credentialed requests from the frontend
app.use((req, res, next) => {
  const origin = req.headers.origin as string | undefined
  const allowedOrigin = process.env.FRONTEND_ORIGIN || '*'
  if (origin && (allowedOrigin === '*' || origin === allowedOrigin)) {
    res.header('Access-Control-Allow-Origin', origin)
  } else if (allowedOrigin !== '*') {
    res.header('Access-Control-Allow-Origin', allowedOrigin)
  }
  res.header('Vary', 'Origin')
  res.header('Access-Control-Allow-Credentials', 'true')
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization')
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS')
  if (req.method === 'OPTIONS') return res.sendStatus(200)
  next()
})
app.use('/api/v1',router)

export default app
