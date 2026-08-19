import axios from "axios";
import { get_token } from "../utils/auth";

const API_URL='http://localhost:5000/api/v1/orders';

export const create_order_service=async (order_data)=>{
    const token=get_token();
    const response=await axios.post(API_URL,order_data,{
        headers:{
           'Authorization':`Bearer ${token}`
        }
    })
    return response.data;
}

export const get_student_orders=async ()=>{
    const token=get_token();
    const response=await axios.get(API_URL,{
        headers:{
            'Authorization':`Bearer ${token}`
        }
    });
    return response.data;
}