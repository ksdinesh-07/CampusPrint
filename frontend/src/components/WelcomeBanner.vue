<template>
    <section class="welcome-banner">

        <div class="welcome-content" >
            <h1>{{ greetings }},{{  user.name }}</h1>
            <p>{{ current_date }}</p>
            <span>Ready to print your documents today?</span>
        </div>

        <router-link to="/student/new-order" class="new-order-btn">
            <i class="fa-solid fa-plus" ></i>
            New Order
        </router-link>

    </section>
</template>

<script setup >

    import { computed } from 'vue';
    import {get_user} from '../utils/auth.js'

    const user=get_user();

    const greetings=computed(()=>{
        const hour=new Date().getHours();
        if (hour < 12) return "Good Morning";
        if (hour < 17)  return "Good Afternoon";
        return 'Good Evening'

    })

    const current_date=computed(()=>{
        return new Date().toLocaleDateString('en-IN',{

        weekday:'long',
        day:'numeric',
        month:'long',
        year:'numeric'

        })
    })

</script>

<style scoped>

@import "../styles/welcome-banner.css";

</style>