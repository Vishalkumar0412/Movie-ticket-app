import app from "./app";
import { config } from "dotenv";
import env from "./config/env";
config();
const PORT=env.PORT 
app.listen(PORT,()=>{
    console.log("server is running on PORT",PORT)
})