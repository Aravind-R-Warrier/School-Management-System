const jwt=require('jsonwebtoken')

const AuthMiddleware=(roles=[])=>{return(req,res,next)=>{
   try {
    const token=req.header("Autharization")?.replace("Bearer ","")
    if(!token){
        res.status(401).json({success:false,message:'no token autharisation denied'})
    }
    const decoded=jwt.verify(token,process.env.JWT_SECRET)
    if(decoded){
        req.user=decoded
        if(roles.length>0 && !roles.includes(req.user.role)){
            return res.status(403).json({success:false,message:'Access denied'})
        }
        next()
    }
   } catch (error) {
    
   }
}}

module.exports=AuthMiddleware