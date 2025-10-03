
interface env {
    PORT: String
}
const env :env ={
    PORT : process.env.PORT || '',
}
export default env