import express,{Request,Response} from 'express'
import userRouter from './user.routes'
const router=express.Router()

const testRouter=function(req :Request,res :Response){
    return res.status(200).json({
        message:"Route is working",
        success:true
    })
}
router.get('/test',testRouter)
router.use('/user',userRouter)
export default router