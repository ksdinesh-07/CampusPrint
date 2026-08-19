<template>
    <div class="stat-card">

        <div class="stat-icon" :class="iconClass">
            <i :class="['fa-solid',icon]" ></i>
        </div>

        <div class="stat-content">

            <p class="stat-title">{{ title }}</p>
            <h2>{{ value }}</h2>
            <span>{{ description }}</span>

        </div>
    </div>
</template>

<script setup >

    defineProps({
        title:{
            type:String,
            required:true
        },
        value:{
            type:[String,Number],
            required:true
        },
        description:{
            type:String,
            required:true
        },
        icon:{
            type:String,
            required:true
        },
        iconClass:{
            type:String,
            default:''
        }
    })

</script>

<style scoped > 
     @import '../styles/stat-card.css'; 
</style>