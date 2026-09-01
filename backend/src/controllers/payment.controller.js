import { create_payment_order_service,verify_payment_service } from "../services/payment.service.js";
import async_handler from "../utils/asyncHandler.js";
import {handle_payment_webhook_service} from '../services/payment.service.js';
import crypto from 'crypto';
import { buffer } from "stream/consumers";
import {db} from "../config/db.js";

export const create_payment_order=async_handler(async(req,res)=>{

    const {order_id}=req.body;

    if(!order_id){
        const error=new Error('Order ID not supported');
        error.statusCode=400;
        throw error;
    }

    const payment_order=await create_payment_order_service(req.user.id,Number(order_id));
    return res.status(201).json({success:true,message:'Payment order created successfully',data:payment_order});

})

export const verify_payment=async_handler(async(req,res)=>{

    const {order_id,razorpay_payment_id,razorpay_order_id,razorpay_signature}=req.body;
    if (!order_id || !razorpay_payment_id || !razorpay_order_id || !razorpay_signature){
        const error=new Error('Payment verification data is incomplete');
        error.statusCode=400;
        throw error;
    }

    const payment=await verify_payment_service(req.user.id,Number(order_id),razorpay_payment_id,razorpay_order_id,razorpay_signature);
    return res.status(200).json({success:true,message:'Payment verified successfully',data:payment});
});

export const payment_webhook=async_handler(async (req,res)=>{

    const webhook_signature=req.headers["x-razorpay-signature"];
    const webhook_event_id=req.headers["x-razorpay-event-id"];

    if(!webhook_signature){
        return res.status(400).json({success:false,message:'Webhook signature missing'});
    }

    if(!webhook_event_id){
        return res.status(400).json({success:false,message:"Webhook event ID missing"})
    }

    if(!process.env.RAZORPAY_WEBHOOK_SECRET){
        const error=new Error("Razorpay webhook secret is not configured");
        error.statusCode=500;
        throw error;
    }

    if(!req.body || !Buffer.isBuffer(req.body)){
        const error=new Error("Webhook raw body missing");
        error.statusCode=400;
        throw new Error;
    }

    const expected_signature=crypto
    .createHmac("sha256",process.env.RAZORPAY_WEBHOOK_SECRET)
    .update(req.body)
    .digest("hex");

    if(expected_signature!==webhook_signature){
        return res.status(400).json({success:false,message:'Invalid webhook signature'});
    }

    const webhook_data=JSON.parse(req.body.toString());

    await handle_payment_webhook_service(webhook_data,webhook_event_id);

    return res.status(200).json({success:true,message:"Webhook processed successfully"})
})

export const get_payment_history=async_handler(async(req,res)=>{
    const user_id=req.user.id;
    const [payments]=await db.execute(`select p.id, o.order_number, p.razorpay_order_id, p.razorpay_payment_id, p.amount, p.currency, p.status, p.method, p.created_at from payments p inner join orders o on p.order_id = o.id where o.user_id=? order by p.created_at desc`,[user_id]);
    
    return res.status(200).json({
        success:true,
        message:"Payment history fetched successfully",
        data:payments
    });
})