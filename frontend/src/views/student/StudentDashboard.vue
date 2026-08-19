<template>
    <div class="student-dashboard">
        <Sidebar />
        <div class="dashboard-content">
            <Navbar />
            <div class="dashboard-body">
                <welcomeBanner />
                <div class="stats-grid">

                    <StatsCard 
                    title="Total-Orders"  :value="12" 
                    description="All your orders"
                    icon="fa-file-lines"
                    icon-class="blue"/>

                    <StatsCard 
                    title="Pending"  :value="2" 
                    description="Orders awaiting processing"
                    icon="fa-clock"
                    icon-class="orange"/>


                    <StatsCard 
                    title="Printing"  :value="1" 
                    description="Currently being printed"
                    icon="fa-print"
                    icon-class="sky"/>


                    <StatsCard 
                    title="Ready"  :value="9" 
                    description="Ready for collection"
                    icon="fa-circle-check"
                    icon-class="green"/>


                </div>
                <QuickActions />
                <RecentOrders />
            </div>
        </div>
    </div>
</template>

<script setup>
import Navbar from '../../components/Navbar.vue';
import QuickActions from '../../components/QuickActions.vue';
import RecentOrders from '../../components/RecentOrders.vue';
import Sidebar from '../../components/Sidebar.vue';
import StatsCard from '../../components/StatsCard.vue';
import '../../styles/student-dashboard.css'
import WelcomeBanner from '../../components/WelcomeBanner.vue';


</script>
