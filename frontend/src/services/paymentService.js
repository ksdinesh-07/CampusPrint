import axios from 'axios';
import {get_token} from '../utils/auth.js';

const API_URL='http://localhost:5000/api/v1/payments';

export const create_payment_order=async(order_id)=>{
    const token=get_token();
    const response=await axios.post(`${API_URL}/create-order`,
        {order_id:order_id},{
            headers:{
                Authorization:`Bearer ${token}`
            }
        });
    return response.data;
}

export const  verify_payment=async(payment_data)=>{

    const token=get_token();
    const response=await axios.post(`${API_URL}/verify`,payment_data,
        {
            headers:{
                Authorization:`Bearer ${token}`
            }
        }
    )
    return response.data;
}