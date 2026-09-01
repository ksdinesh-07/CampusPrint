<template>

    <div class="order-details-header">

        <div>
            <h1>Order Details</h1>
            <p>View the complete information about your print Order</p>
        </div>

        <router-link to="/student/orders" class="back-btn" >
            <i class="fa-solid fa-arrow-left" ></i>
            Back to orders
        </router-link>

    </div>

    <div v-if="loading" class="state-card">
        <i class="fa-solid fa-spinner fa-spin"></i>
        <h3>Loading order...</h3>
        <p>Please wait while we fetch the order details.</p>
    </div>

    <div v-else-if="error" class="state-card error-state">
        <i class="fa-solid fa-circle-exclamation"></i>
        <h3>Unable to load order</h3>
        <p>{{ error }}</p>
        <router-link to="/student/orders" class="back-btn">
            Back to Orders
        </router-link>
    </div>

    <div v-else-if="order" class="order-details-container">

        <div class="order-summary-card">

            <div>
                <span class="order-label">Order Number</span>
                <h2>{{ order.order_number }}</h2>
                <p>Placed on{{ format_date(order.created_at) }}</p>
            </div>

            <div class="status-section">
                <span class="status-badge" :class="`status-${order.status}`"> {{ order.status }} </span>
                <span class="payment-badge" :class="`payment-${order.payment_status}`"> Payment: {{ order.payment_status }}</span>
            </div>

        </div>

        <div class="details-card">

            <div class="card-title">
                <i class="fa-solid fa-file"></i>
                <h3>Document</h3>
            </div>

            <div class="document-info">

                <div class="document-icon">
                    <i class="fa-solid fa-file-pdf"></i>
                </div>

                <div>
                    <h4>{{ order.file_name }}</h4>
                    <p>{{ format_file_size(order.file_size) }}</p>
                </div>

            </div>

        </div>

        <div class="details-card">

            <div class="card-title">
                <i class="fa-solid fa-print"></i>
                <h3>Print Details</h3>
            </div>

            <div class="details-grid">

                <div class="detail-item">
                    <span>Print Type</span>
                    <strong>{{order.print_type === 'bw' ? 'Black & White': 'Color'}}</strong>
                </div>

                <div class="detail-item">
                    <span>Pages</span>
                    <strong>{{ order.pages }}</strong>
                </div>

                <div class="detail-item">
                    <span>Copies</span>
                    <strong>{{ order.copies }}</strong>
                </div>

                <div class="detail-item">
                    <span>Sides</span>
                    <strong>{{order.sides === 'single' ? 'Single Side' : 'Double Side'}}</strong>
                </div>

                <div class="detail-item">
                    <span>Lamination</span>
                    <strong>{{order.lamination? 'Yes': 'No'}}</strong>
                </div>

            </div>

        </div>

        <div class="details-card">

            <div class="card-title">
                <i class="fa-solid fa-indian-rupee-sign"></i>
                <h3>Payment Summary</h3>
            </div>

            <div class="price-row">
                <span>Printing Cost</span>
                <strong>₹{{ Number(order.printing_cost).toFixed(2) }}</strong>
            </div>

            <div class="price-row">
                <span>Lamination Cost</span>
                <strong>₹{{ Number(order.lamination_cost).toFixed(2) }}</strong>
            </div>

            <div class="price-divider"></div>

            <div class="price-row total-row">
                <span>Total</span>
                <strong>₹{{ Number(order.total_cost).toFixed(2) }}</strong>
            </div>

        </div>

        <div v-if="order.payment_status === 'pending'" class="payment-action-card">
                
            <div>
                <h3>Payment Pending</h3>
                <p>Complete your payment to proceed with your print order.</p>
            </div>

            <button class="pay-btn" @click="pay_now"><i class="fa-solid fa-credit-card"></i>Pay Now</button>

        </div>


    </div>

</template>

<script setup>
    import {ref,onMounted} from 'vue';
    import {useRoute} from 'vue-router';
    import axios from 'axios';
    import {get_token} from  '../../utils/auth.js';
    import { create_payment_order,verify_payment } from '../../services/paymentService.js';

    const route=useRoute();
    const order=ref(null);
    const loading=ref(true);
    const error=ref(null);

    const fetch_order=async()=>{
        try{
            loading.value=true;
            error.value=null;
            const token=get_token();

            const response=await axios.get(`http://localhost:5000/api/v1/orders/${route.params.id}`,
            {
                headers:{
                    Authorization:`Bearer ${token}`
                }
            })
            console.log('Order details response:',response.data);
            order.value=response.data.data;

        }catch(err){
            console.log("Failed to fetch order",err);
            if (err.response?.status===404){
                error.value='Order not found.';
            }else if(err.response?.status===401){
                error.value='Your session has expired.Please login again.';
            }else{
                error.value='Unable to load order details.'
            }
        }finally{
            loading.value=false;
        }
    };


    const format_date=(date)=>{
        if(!date) return '';
        return new Date(date).toLocaleString('en-IN',{dateStyle:'medium',timeStyle:'short'}) 
    }

    const format_file_size=(bytes)=>{
        if (!bytes) return '0 KB';
        return `${(bytes/1024).toFixed(2)} KB`;
    }

    const pay_now=async()=>{
        try{
            const response=await create_payment_order(order.value.id);
            console.log('Payment order response:',response);
            const payment_data=response.data;
            const options={
                key:payment_data.key_id,
                amount:payment_data.amount,
                currency:payment_data.currency,
                name:'Campus Print',
                description:`Payment for order ${payment_data.order_number}`,
                order_id:payment_data.razorpay_order_id,

                handler:async function(payment_response){
                    console.log("Razorpay payment response:",payment_response);

                    try{
                        const verification_response=await verify_payment({
                            order_id:order.value.id,
                            razorpay_payment_id:payment_response.razorpay_payment_id,
                            razorpay_order_id:payment_response.razorpay_order_id,
                            razorpay_signature:payment_response.razorpay_signature
                        })
                        console.log('Payment verification response:',verification_response);

                        if(verification_response.success){
                            alert("Payment successful!");
                            await fetch_order();
                        }

                    }catch(err){
                        console.log("Payment verification failed:",err);
                        alert("Payment was completed, but verification failed.")
                    }
                },
                prefill:{
                    name:'',
                    email:''
                },
                theme:{
                    color:'#2563eb'
                },
                modal:{
                    ondismiss:function(){
                        console.log("Payment popup closed");
                    }
                }
            }
            const razorpay=new window.Razorpay(options);
            razorpay.open();
        }catch(err){
            console.error("Payment initiation failed:", err);
            alert("Unable to initiate payment.");        }
    }

    onMounted(()=>{
        fetch_order();
    });

</script>

<style scoped>
    @import '../../styles/order-details.css';
</style>