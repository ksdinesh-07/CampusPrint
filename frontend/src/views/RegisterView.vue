<template>
    <div class="auth-container">
        <div class="auth-card">
            <h1>Campus Print</h1>
            <h2>Register</h2>

            <form @submit.prevent='register_user'>
                <div class="form-group">
                    <label>Name</label>
                    <input type="text" v-model="form.name" placeholder="Enter the Name">
                </div>

                <div class="form-group">
                    <label>Email</label>
                    <input type="email" v-model="form.email" placeholder="Enter your email">
                </div>

                <div class="form-group">
                    <label>Password</label>
                    <input type="password" v-model="form.password" placeholder="Enter your password">
                </div>

                <div class="form-group">
                    <label>Phone</label>
                    <input type="text" v-model="form.phone" placeholder="Enter your phone">
                </div>

                <div class="form-group">
                    <label>Department</label>
                    <input type="text" v-model="form.department" placeholder="Enter your department">
                </div>

                <div class="form-group">
                    <label>Role</label>
                    <select v-model="form.role">
                        <option value="student">Student</option>
                        <option value="staff">Staff</option>
                        <option value="admin">Admin</option>
                    </select>
                </div>

                <button type="submit" class="primary-btn">
                    Register
                </button>
            </form>

            <div class="divider">
                OR
            </div>

            <button @click="google_register" class="google-btn">
                Sign up with Google
            </button>

            <p class="auth-link">
                Already have an account?
                <router-link to="/">Login</router-link>
            </p>
        </div>
    </div>
</template>

<script setup>

    import {ref} from 'vue';
    import { register_user_service } from '../services/auth.service.js';
    import router from '../router/index.js';

    const form=ref({
        name:'',
        email:'',
        password:'',
        phone:'',
        department:'',
        role:'student'
    });

    const register_user=async()=>{
        try{

        const result=await register_user_service(form.value);
        alert(result.message)

        if (result.success){
            form.value={
                name:'',
                email:'',
                password:'',
                phone:'',
                department:'',
                role:'student'
            };
        }

        }catch(err){
            alert(err.message)
        }
    };


</script>

