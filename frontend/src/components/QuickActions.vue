<template>
    <section class="quick-actions">
        <div class="section-header">

            <div>
                <h2>Quick Actions</h2>
                <p>Access your frequently used services</p>
            </div>

            <div class="actions-grid">

                <router-link
                to="/student/new-order"
                class="action-card">

                    <div class="action-icon blue">
                        <i class="fa-solid fa-print"></i>
                    </div>

                    <div class="action-content">
                        <h3>New Print Order</h3>
                        <p>Upload your document and create a new print order.</p>
                    </div>

                    <i class="fa-solid fa-arrow-right action-arrow"></i>

                </router-link>


                <router-link
                to="/student/orders"
                class="action-card">

                    <div class="action-icon purple">
                        <i class="fa-solid fa-clipboard-list"></i>
                    </div>

                    <div class="action-content">
                        <h3>My Orders</h3>
                        <p>Track your existing print orders and their status.</p>
                    </div>

                    <i class="fa-solid fa-arrow-right action-arrow"></i>

                </router-link>


                <router-link
                to="/student/Payments"
                class="action-card">

                    <div class="action-icon green">
                        <i class="fa-solid fa-credit-card"></i>
                    </div>

                    <div class="action-content">
                        <h3>Payments</h3>
                        <p>View your payment history and transactions.</p>
                    </div>

                    <i class="fa-solid fa-arrow-right action-arrow"></i>

                </router-link>


            </div>
        </div>
    </section>
</template>

<style scoped >
    @import '../styles/quick-actions.css'
</style>