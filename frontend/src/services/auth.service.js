import { register_user,login_user,get_current_user } from "../api/auth.api.js";

export const register_user_service=async(data)=>{
    try{
        const response =await register_user(data)
        return response;

    }catch(err){
        return {
            success:false,
            message:err.response?.data?.message || 'Registration failed'
        };
    }
};

export const login_user_service=async(data)=>{
    try{
        return await login_user(data)
    }catch (err){
        return {
            success:false,
            message:err.response?.data?.message || 'Login failed'
        }
    }
}

export const get_current_user_service=async()=>{
    try{
        return await get_current_user();
    }catch(err){
        return{
            success:false,
            message: err.response?.data?.message || 'Failed to fetch user'
        }
    }
}