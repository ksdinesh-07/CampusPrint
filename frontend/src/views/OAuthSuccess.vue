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
        router.push('/login')
    }
    localStorage.setItem('token',token);

    const result=await get_current_user_service();

    if(result.success){
        localStorage.setItem("user",JSON.stringify(result.data))
        router.push('/dashboard');
    }else{
        localStorage.removeItem('token');
        route.push('/login')
    }
})
</script>