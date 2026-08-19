<template>
    <h2>Signing you in...</h2>
</template>

<script setup >

import { onMounted } from 'vue';
import { useRoute,useRouter } from 'vue-router';
import { get_current_user_service } from '../services/auth.service';
 
const route=useRoute();
const router=useRouter();

onMounted(async()=>{
    const token=route.query.token;

    if(!token){
        router.push('/login');
        return
    }
    localStorage.setItem('token',token);

    const result=await get_current_user_service();

    if(result.success){

        localStorage.setItem("user",JSON.stringify(result.data))
        const user=result.data;

        if (user.role === "student") {
            router.replace("/student/dashboard");
        }
        else if (user.role === "staff") {
            router.replace("/staff/dashboard");
        }
        else if (user.role === "admin") {
            router.replace("/admin/dashboard");
        }
        else{
            router.replace('/');
        }
    }else{
        localStorage.removeItem('token');
        route.push('/login')
    }
})
</script>