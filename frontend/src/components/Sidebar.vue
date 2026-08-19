<template>
    <aside class="sidebar">

        <div class="logo">
            <h2>Campus<span>Print</span></h2>
        </div>

        <nav>

            <router-link 
            v-for="item in menus"
            :key="item.title"
            :to='item.route' class="nav-item" active-class="active">
                <i :class="['fa-solid' ,item.icon]"></i>
                {{item.title }}
            </router-link>

        </nav>
    </aside>
</template>

<script setup >

import '../styles/sidebar.css'
import {ref,onMounted} from 'vue';
import {menu_items} from '../config/menu.js'

const menus=ref([]);

onMounted(()=>{
    const user=JSON.parse(localStorage.getItem('user'))
    if(user){
        menus.value=menu_items[user.role]
    }
})


</script>