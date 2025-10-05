import { config } from "dotenv"
config()
interface env {
    PORT: string
    MONGO_URI: string
    JWT_SECRET: string
    NODE_ENV:string
    CLOUDINARY_CLOUD_NAME?: string
    CLOUDINARY_API_KEY?: string
    CLOUDINARY_API_SECRET?: string
}
const env :env ={
    PORT : process.env.PORT || '3000',
    MONGO_URI: process.env.MONGO_URI || '',
    NODE_ENV: process.env.NODE_ENV || '',
    JWT_SECRET:process.env.JWT_SECRET ||'',
    CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
    CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
    CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,
}
export default env