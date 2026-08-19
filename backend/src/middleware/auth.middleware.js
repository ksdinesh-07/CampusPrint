import jwt from 'jsonwebtoken';

export const verify_token=(req,res,next)=>{
    const auth_header=req.headers.authorization;

    if (!auth_header){
        return res.status(401).json({
            success:false,
            message:"Token missing"
        })
    }
    const token=auth_header.split(" ")[1];
    try{
        const decoded=jwt.verify(token,process.env.JWT_SECRET);
        req.user=decoded;
        next();
    }catch(err){
        return res.status(401).json({success:false,message:'invalid token'})
    }
}

