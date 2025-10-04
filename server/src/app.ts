import {config} from 'dotenv'
import express from 'express'
import cookieParser from 'cookie-parser'
import router from './routes/index.routes'
config()
const app=express()
app.use(express.json())
app.use(cookieParser())
app.use('/api/v1',router)

export default app
