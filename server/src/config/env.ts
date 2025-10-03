
interface env {
    PORT: string
    MONGO_URI: string
    JWT_SECRET: string
    NODE_ENV:string
}
const env :env ={
    PORT : process.env.PORT || '',
    MONGO_URI: process.env.MONGO_URI || '',
    NODE_ENV: process.env.NODE_ENV || '',
    JWT_SECRET:process.env.JWT_SECRET ||''
}
export default env