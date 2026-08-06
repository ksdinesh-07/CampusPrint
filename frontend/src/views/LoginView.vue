<template>
    <div class="auth-container">

        <div class="auth-card">

            <h1>Campus Print</h1>

            <h2>Login</h2>

            <form @submit.prevent="login_user">

                <div class="form-group">
                    <label>Email</label>

                    <input type="email" v-model="form.email" placeholder="Enter your email">
                </div>

                <div class="form-group">
                    <label>Password</label>

                    <input type="password" v-model="form.password" placeholder="Enter your password">
                </div>

                <button type="submit" class="primary-btn">
                    Login
                </button>

            </form>

            <div class="divider">
                OR
            </div>

            <button @click="google_login" class="google-btn">
                Continue with Google
            </button>

            <p class="auth-link">
                Don't have an account?

                <router-link to="/register">
                    Register
                </router-link>
            </p>

        </div>

    </div>
</template>


<script setup>
    import router from "../router/index.js";
    import {ref} from 'vue'
    import { login_user_service } from '../services/auth.service.js';
    //import {get_user,is_student,get_role,is_admin} from '../utils/auth.js'


    const form=ref({
        email:'',
        password:''
    })

    const login_user=async()=>{
        const result=await login_user_service(form.value);
        console.log(result)
        alert (result.message);

        if(result.success){
            localStorage.setItem('token',result.token);
            localStorage.setItem("user",JSON.stringify(result.data));
            await router.push("/dashboard");
        }
    };

    const google_login=()=>{
        window.location.href= "http://localhost:5000/api/v1/auth/google";
    }

</script>

