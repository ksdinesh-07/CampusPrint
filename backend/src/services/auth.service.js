import bcrypt from 'bcrypt';
import { find_user_by_email,create_user, update_google_id,find_user_by_id } from '../models/user.model.js';
import jwt from 'jsonwebtoken';

export const register_user_service=async(data)=>{
    const existing_user=await find_user_by_email(data.email);
    if(existing_user){
        throw new Error("Email already exists");
    }

    const {password,...rest}=data;
    const hashed_password=await bcrypt.hash(password,10)
    const new_user={google_id:null, ...rest,password_hash:hashed_password};
    const user_id=await create_user(new_user);

    return{
        id:user_id,
        message:`${new_user.role} registered successfully`,
        data: {
            id: user_id,
            name: new_user.name,
            email: new_user.email,
            phone: new_user.phone,
            department: new_user.department,
            role: new_user.role
        }
    }
}

export const login_service=async (data)=>{
    const existing_user=await find_user_by_email(data.email);
    if (!existing_user){
        throw new Error('Invalid email or password')
    }
    const is_valid_password=await bcrypt.compare(data.password,existing_user.password_hash)
    if (!is_valid_password){
        throw new Error('Invalid email or password')
    }

    const token=jwt.sign(
        {
        id:existing_user.id,
        email:existing_user.email,
        role:existing_user.role
        },
        process.env.JWT_SECRET,
        {
            expiresIn:'1d'
        }
    );
    return {
        success: true,
        message: "Login successful",
        token,
        data: {
            id: existing_user.id,
            name: existing_user.name,
            email: existing_user.email,
            phone: existing_user.phone,
            department: existing_user.department,
            role: existing_user.role
        }
    }

}

export const google_auth_services=async(profile)=>{
    const email=profile.emails[0].value
    const name=profile.displayName;
    const google_id=profile.id;

    let user=await find_user_by_email(email);
    if (user){
        if (!user.google_id){
            await update_google_id(user.id,google_id)
            user.google_id=google_id;
            }
        }   
        else{
            const new_user={
                google_id:google_id,
                name,
                email,
                password_hash:null,
                phone:null,
                department:null,
                role:'student'
            };

            const id=await create_user(new_user);
            user={
                id,...new_user
            };
        }
        const token=jwt.sign(
            {
                id:user.id,
                email:user.email,
                role:user.role
            },
            process.env.JWT_SECRET,{
                expiresIn:"1d"
            }
        );

        return {
            token,user
        } 
}

export const current_user_service=async (id)=>{
    const user=await find_user_by_id(id);
    if(!user){
        throw new Error('User not found');
    }
    return user;
}