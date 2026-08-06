<template>
    <h1>Dashboard</h1>
    <p>Google Login Successful 🎉</p>

    <button @click="logout">logout</button>
</template>

<script setup >
    
    import { useRouter } from 'vue-router';

    const router=useRouter();
    const logout=()=>{
        localStorage.removeItem('token');
        router.push('/login');
    }

</script>