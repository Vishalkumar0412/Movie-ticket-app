import {config} from 'dotenv'
import express from 'express'
import router from './routes/index.routes'
config()
const app=express()
app.use('/api/v1',router)

export default app
