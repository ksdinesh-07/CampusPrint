import { razorpay } from "../config/razorpay.js";
import {db} from "../config/db.js";
import crypto from 'crypto';
import { update_google_id } from "../models/user.model.js";

export const create_payment_order_service = async (user_id, order_id) => {

    const [orders] = await db.execute(
        `SELECT 
            id,
            order_number,
            user_id,
            total_cost,
            payment_status
         FROM orders
         WHERE id = ? AND user_id = ?`,
        [order_id, user_id]
    );


    if (orders.length === 0) {
        const error = new Error("Order not found");
        error.statusCode = 404;
        throw error;
    }

    const order = orders[0];

    if (order.payment_status === "paid") {
        const error = new Error("Order is already paid");
        error.statusCode = 400;
        throw error;
    }

    const amount = Math.round(Number(order.total_cost) * 100);

    const razorpay_order = await razorpay.orders.create({
        amount: amount,
        currency: "INR",
        receipt: order.order_number,
        notes:{
            order_number:order.order_number
        }
    });

    return {
        razorpay_order_id: razorpay_order.id,
        order_id: order.id,
        order_number: order.order_number,
        amount: amount,
        currency: "INR",
        key_id: process.env.RAZORPAY_KEY_ID
    };
};

export const verify_payment_service = async (user_id,order_id,razorpay_payment_id,razorpay_order_id,razorpay_signature) => {

    if (!order_id || !razorpay_payment_id || !razorpay_order_id || !razorpay_signature) {
        const error = new Error("Payment verification data is incomplete");
        error.statusCode = 400;
        throw error;
    }

    const [orders] = await db.execute(`SELECT id,order_number,user_id,total_cost,payment_status FROM orders WHERE id = ? AND user_id = ?`, [order_id, user_id]);

    if (orders.length === 0) {
        const error = new Error("Order not found");
        error.statusCode = 404;
        throw error;
    }

    const order = orders[0];

    if (order.payment_status === "paid") {
        const error = new Error("Order is already paid");
        error.statusCode = 400;
        throw error;
    }

    const generated_signature = crypto
        .createHmac(
            "sha256",
            process.env.RAZORPAY_KEY_SECRET
        )
        .update(
            `${razorpay_order_id}|${razorpay_payment_id}`
        )
        .digest("hex");

    if (generated_signature !== razorpay_signature) {
        const error = new Error("Invalid payment signature");
        error.statusCode = 400;
        throw error;
    }

    const [existing_payments] = await db.execute(`SELECT id,order_id,razorpay_order_id,razorpay_payment_id,amount,currency,status,method FROM payments WHERE razorpay_payment_id = ? LIMIT 1`,[razorpay_payment_id]);

    if (existing_payments.length === 0) {
        await db.execute(`INSERT INTO payments (order_id,razorpay_order_id,razorpay_payment_id,amount,currency,status,method) VALUES (?, ?, ?, ?, ?, ?, ?)`,[order.id,razorpay_order_id,razorpay_payment_id,order.total_cost,"INR","captured","unknown"]);
    }

    await db.execute(`UPDATE orders SET payment_status = 'paid', updated_at = CURRENT_TIMESTAMP WHERE id = ? AND user_id = ?`, [order_id, user_id]);

    return {order_id: order.id,order_number: order.order_number,razorpay_payment_id,razorpay_order_id,payment_status: "paid"};
};

// export const handle_payment_webhook_service=async(webhook_data,webhook_event_id)=>{

//     console.log("===== RAZORPAY WEBHOOK =====");
//     console.log("Event:", webhook_data.event);
//     console.log("Event ID:", webhook_event_id);
//     console.log("============================");

//     if(webhook_data.event!=='payment.captured'){
//         const payment_entity=webhook_data.payload.payment.entity;
//         const razorpay_payment_id=payment_entity.id;
//         const razorpay_order_id=payment_entity.order_id;
//         const amount=Number(payment_entity.amount)/100;
//         const currency=payment_entity.currency;
//         const method=payment_entity.method;

        
//         console.log("Razorpay Payment ID:", razorpay_payment_id);
//         console.log("Razorpay Order ID:", razorpay_order_id);
//         console.log("Amount:", amount);
//         console.log("Method:", method);

//         const [orders]=await db.execute(`select id,order_number,user_id,total_cost,payment_status from orders where order_number=? `,[payment_entity.notes?.order_number]);
//         if (orders.length===0){
//             console.log('Campus print order not found')
//             return false;
//         }

//         const order=orders[0];

//         const [existing_payments]=await db.execute(`select id from payments where razorpay_payment_id =?`,[razorpay_payment_id]);
//         if (existing_payments.length>0){
//             console.log('Payment already processed:',razorpay_payment_id);
//             return true;
//         }

//         //save the payment
//         await db.execute(`insert into payments (order_id,razorpay_order_id,razorpay_payment_id,amount,currency,status,method,webhook_event_id) values (?,?,?,?,?,'captured',?,?)`,[order.id,razorpay_order_id,razorpay_payment_id,amount,currency,method,webhook_event_id]);
        
//         //update campus_print order
//         await db.execute(`update orders set payment_status='paid', updated_at=CURRENT_TIMESTAMP where id=?`,[order.id]);

//         console.log('Campus Print order marked as PAID:',order.order_number);
        
//     };

//     return true;
// }

export const handle_payment_webhook_service=async(webhook_data,webhook_event_id)=>{

    console.log("===== RAZORPAY WEBHOOK =====");
    console.log("Event:", webhook_data.event);
    console.log("Event ID:", webhook_event_id);
    console.log("============================");

    if(webhook_data.event!=='payment.captured'){
        console.log("Event ignored:",webhook_data.event);
        return true;
    }

    const payment_entity=webhook_data?.payload?.payment?.payment_entity;
    if(!payment_entity){
        const error=new Error("Payment entity missing");
        error.statusCode=400;
        throw error;
    };

    const razorpay_payment_id = payment_entity.id;
    const razorpay_order_id = payment_entity.order_id;
    const amount_in_paise = payment_entity.amount;
    const currency = payment_entity.currency;
    const method = payment_entity.method;
    const order_number = payment_entity?.notes?.order_number;

    if(!razorpay_order_id){
        const error=new Error('Razorpay order ID missing');
        error.statusCode=400;
        throw error;
    }

    if(amount_in_paise===undefined || amount_in_paise===null){
        const error=new Error("Payment amount is missing");
        error.statusCode=400;
        throw error;
    };

    if(!currency){
        const error=new Error("Payment currency missing");
        error.statusCode=400;
        throw error;
    };

    if(!method){
        const error=new Error("Payment method is missing");
        error.statusCode=400;
        throw error;
    };

    if(!order_number){
        const error=new Error("Order number is missing");
        error.statusCode=400;
        throw error;
    };

    const amount=Number(amount_in_paise)/100;
    if(!Number.isFinite(amount) || amount<=0){
        const error=new Error("Invalid payment amount");
        error.statusCode=400;
        throw error;
    };
    
    console.log("Razorpay Payment ID:", razorpay_payment_id);
    console.log("Razorpay Order ID:", razorpay_order_id);
    console.log("Order Number:", order_number);
    console.log("Amount:", amount);
    console.log("Currency:", currency);
    console.log("Method:", method);

    const [orders]=await db.execute(`select id,order_number,user_id,total_cost,payment_status from orders where order_number = ? limit 1`,[order_number]);
    if(orders.length===0){
        const error=new Error("Campus print order not found");
        error.statusCode=404;
        throw error;
    }

    const order=orders[0];

    const [existing_payments]=await db.execute(`select id from paymnets where razorpay_order_id= ? limit 1`,[razorpay_order_id]);
    if (existing_payments.length>0){
        console.log('Payment already processed:',razorpay_payment_id);
        return true;
    };

    if(order.payment_status==='paid'){
        console.log("Order already marked as paid: ",order.order_number);
        return true;
    }

    const order_total=Number(order.total_cost);

    if(!Number.isFinite(order_total)){
        const error=new Error('Invalid order total');
        error.statusCode=500;
        throw error;
    };

    if(amount!==order_total){
        const error=new Error("Payment amount does not match order total");
        error.statusCode=400;
        throw error;
    };

    //save payment
    await db.execute(`insert into payments (order_id,razorpay_order_id,razorpay_payment_id,amount,currency,status,method,webhook_event_id) values (?,?,?,?,?,?,?,?)`,[order.id,razorpay_order_id,razorpay_payment_id,amount,currency,"captured",method,webhook_event_id]);

    //update campus print order
    await db.execute(`UPDATE orders SET payment_status = 'paid', updated_at = CURRENT_TIMESTAMP WHERE id = ? AND payment_status <> 'paid'`,[order.id]);

    console.log("Campus Print order marked as PAID:",order.order_number);

    return true;
}

