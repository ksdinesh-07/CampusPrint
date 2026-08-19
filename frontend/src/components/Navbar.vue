<template>
    <header class="navbar" >

        <div class="navbar-left">
            <h2>Student Dashboard</h2>
            <p>Welcome back</p>
        </div>

        <div class="navbar-right">

            <button class="notification-btn">
                <i class="fa-solid fa-bell" ></i>
            </button>

            <div class="profile">

                <div class="profile-info">
                    <h4>{{ user.name }}</h4>
                    <small>{{ user.role }}</small>
                </div>

                <img :src="avatar" alt="profile">

            </div>

            <button class="logout-btn" @click="logout" >
                <i class="fa-solid fa-right-from-bracket" ></i>
                Logout
            </button>

        </div>

    </header>

</template>

<script setup >

    import {ref,onMounted,computed} from 'vue';
    import { useRouter } from 'vue-router';
    import { get_user,logout as log_out} from '../utils/auth';

    const router=useRouter();
    const user=ref({
        name:'',
        role:''
    })

    const avatar=computed(()=>{
        if(!user.value.name) return '';
        return `https://ui-avatars.com/api/?name=${encodeURIComponent(user.value.name)}&background=2563eb&color=ffffff`;
    })

    onMounted(()=>{
        const current_user = get_user();
        if(current_user){
            user.value=current_user;
        }
    })

    const logout=()=>{  
        const confirm_logout=confirm('Are you sure you want to logout?'); 
        if(!confirm_logout) return ;
        log_out();
        router.replace('/');
    }

</script>

<style scoped>

@import '../styles/navbar.css'

</style>