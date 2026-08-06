import {register_user_service,login_service,current_user_service} from '../services/auth.service.js';
import async_handler from '../utils/asyncHandler.js';


export const register_user=async_handler( async(req,res)=>{
    const result=await register_user_service(req.body);
    return res.status(201).json({success:true,message:result.message,data:result.data})
});

export const login=async_handler(async (req,res)=>{
    const result=await login_service(req.body);
    return res.status(200).json(result)
})

export const current_user=async_handler(async(req,res)=>{
    const user=await current_user_service(req.user.id)
    res.json({success:true,data:user})
})