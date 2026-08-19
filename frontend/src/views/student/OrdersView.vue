<template>
    <div class="orders-page">

        <div class="orders-header">
            <div>
                <h1>My Orders</h1>
                <p>View and track all your print orders.</p>
            </div>
        </div>


        <div v-if="loading" class="state-card">
            <i class="fa-solid fa-spinner fa-spin"></i>
            <h3>Loading orders...</h3>
            <p>Please wait while we fetch your orders.</p>
        </div>


        <div v-else-if="error" class="state-card error-state">
            <i class="fa-solid fa-circle-exclamation"></i>
            <h3>Unable to load orders</h3>
            <p>{{ error }}</p>
        </div>


        <div v-else-if="orders.length === 0" class="state-card">
            <i class="fa-solid fa-box-open"></i>
            <h3>No orders found</h3>
            <p>You haven't placed any print orders yet.</p>

            <router-link to="/student/new-order" class="new-order-btn" > <i class="fa-solid fa-plus"></i>
                Create New Order
            </router-link>
        </div>


        <div v-else class="orders-list">
            <div v-for="order in orders" :key="order.id" class="order-card" >

                <div class="order-card-header">

                    <div>
                        <span class="order-label"> Order Number</span>
                        <h3>{{ order.order_number }}</h3>
                    </div>

                    <span class="status-badge" :class="`status-${order.status}`">
                        {{ order.status }}
                    </span>

                </div>


                <div class="file-info">

                    <div class="file-icon">
                        <i class="fa-solid" :class="get_file_icon(order.file_name)"></i>
                    </div>

                    <div>
                        <h4>{{ order.file_name }}</h4>
                        <p>{{ order.print_type === 'bw' ? 'Black & White': 'Color'}}</p>
                    </div>

                </div>


                <div class="order-details">

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
                        <strong>{{ order.sides === 'single'? 'Single': 'Double'}}</strong>
                    </div>

                    <div class="detail-item">
                        <span>Lamination</span>
                        <strong>{{ order.lamination? 'Yes':'No'}}</strong>
                    </div>

                    <div class="detail-item">
                        <span>Payment</span>
                        <strong class="payment-status" :class="`payment-${order.payment_status}`">{{ order.payment_status }}</strong>                    
                    </div>

                </div>

                <div class="order-card-footer">

                    <div>
                        <span>Total</span>
                        <strong>₹{{ Number(order.total_cost).toFixed(2) }}</strong>
                    </div>

                    <router-link :to="`/student/orders/${order.id}`" class="view-order-btn">
                        View Details
                        <i class="fa-solid fa-arrow-right"></i>
                    </router-link>

                </div>

            </div>
        </div>

    </div>
</template>


<script setup>

    import { ref, onMounted } from 'vue';
    import { get_student_orders } from '../../services/orderService.js';

    const orders = ref([]);
    const loading = ref(true);
    const error = ref(null);


    const fetch_orders = async () => {
        try {
            loading.value = true;
            error.value = null;
            const response = await get_student_orders();
            orders.value = response.data;
        } catch (err) {
            console.error("Failed to fetch orders:", err);
            error.value = "Unable to load your orders.";
        } finally {
            loading.value = false;
        }
    };

    onMounted(() => {
        fetch_orders();
    });

const get_file_icon = (file_name) => {

    const extension = file_name.split('.').pop().toLowerCase();
    if (extension === 'pdf') {
        return 'fa-file-pdf';
    }
    if (extension === 'doc' || extension === 'docx') {
        return 'fa-file-word';
    }
    if (['jpg', 'jpeg', 'png'].includes(extension)) {
        return 'fa-file-image';
    }
    return 'fa-file';
};

</script>


<style scoped>
@import '../../styles/orders.css';
</style>