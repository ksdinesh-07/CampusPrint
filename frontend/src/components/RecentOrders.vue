<template>
    <section class="recent-orders">

        <div class="section-header">

            <div>
                <h2>Recent Orders</h2>
                <p>Your latest print orders</p>
            </div>

            <router-link
            to="/student/orders"
            class="view-all">
                View All
                <i class="fa-solid fa-arrow-right" ></i>
            </router-link>
        </div>

        <div class="orders-card">
            <div class="table-wrapper">
                <table>

                    <thead>
                        <tr>
                            <th>Order</th>
                            <th>Document</th>
                            <th>Type</th>
                            <th>Pages</th>
                            <th>Amount</th>
                            <th>Status</th>
                            <th>Action</th>
                        </tr>
                    </thead>

                    <tbody>
                        <tr v-for="order in orders" :key="order.id" >

                            <td><strong>{{ order.orderNumber }}</strong></td>

                            <td>
                                <div class="document-info">
                                    <i class="fa-solid fa-file-lines" ></i>
                                    <span>{{ order.document }}</span>
                                </div>
                            </td>

                            <td>{{ order.type }}</td>
                            <td>{{ order.pages }}</td>
                            <td>₹{{ order.amount }}</td>
                            <td>
                                <span class="status" :class="order.status.toLowerCase()">
                                    {{ order.Status }}
                                </span>
                            </td>
                            <td>
                                <router-link :to='`/student/orders/${order.id}`' class='view-order'>
                                    <i class="fa-solid fa-eye" ></i>
                                </router-link>
                            </td>


                        </tr>
                    </tbody>

                </table>
            </div>
        </div>

    </section>
</template>


<script setup>

    import {ref} from 'vue';

    const orders=ref([
        {
            id:1,
            orderNumber:"#CP10001",
            document:'Assignment.pdf',
            type:'Black & White',
            pages:12,
            amount:36,
            status:"Ready"
        },   
        {
            id: 2,
            orderNumber: "#CP1002",
            document: "Project_Report.pdf",
            type: "Color",
            pages: 24,
            amount: 120,
            status: "Printing"
        },

        {
            id: 3,
            orderNumber: "#CP1003",
            document: "Resume.pdf",
            type: "Black & White",
            pages: 3,
            amount: 9,
            status: "Pending"
        }
    ])


</script>

<style scoped>
    @import '../styles/recent-orders.css';
</style>