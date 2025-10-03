
interface env {
    PORT: string
    MONGO_URI: string
}
const env :env ={
    PORT : process.env.PORT || '',
    MONGO_URI: process.env.MONGO_URI || '',
}
export default env