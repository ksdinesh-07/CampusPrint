import axios from 'axios';

const API = axios.create({
    baseURL:'http://localhost:5000/api/v1/auth',

    headers:{
        'Content-Type':'application/json'
    }
})

export const register_user=async (data)=>{
    const response=await API.post('/register',data);
    return response.data;
}

export const login_user=async (data)=>{
    const response=await API.post('/login',data)
    return response.data
}

export const get_current_user=async()=>{
    const response=await API.get('/me',{headers:{
    Authorization: `Bearer ${localStorage.getItem("token")}`    
    }});
    return response.data;
}