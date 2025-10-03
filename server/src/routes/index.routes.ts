import express,{Request,Response} from 'express'
const router=express.Router()
const testRouter=function(req :Request,res :Response){
    return res.status(200).json({
        message:"Route is working",
        success:true
    })
}
router.get('/test',testRouter)
export default router