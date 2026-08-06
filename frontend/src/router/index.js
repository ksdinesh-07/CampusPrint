import {createRouter,createWebHistory} from 'vue-router';
import OAuthSuccess from '../views/OAuthSuccess.vue';
import LoginView from '../views/LoginView.vue';
import RegisterView from '../views/RegisterView.vue';
import DashboardView from '../views/DashboardView.vue';
import { is_authenticated } from '../utils/auth.js';

const routes=[
    {
        path:'/',
        redirect:'/login'
    },
    {
        path:'/login',
        name:'login',
        component:LoginView
    },
    {
        path:'/register',
        name:'register',
        component:RegisterView
    },
    {
        path:'/dashboard',
        name:'dashboard',
        component:DashboardView
    },
    {
        path:'/oauth-success',
        component:OAuthSuccess
    }
]


const router=createRouter({
    history:createWebHistory(),
    routes
})

router.beforeEach((to)=>{
    const logged_in=is_authenticated();

    if(to.path=='/dashboard' && !logged_in){
        return '/login';
    }

    return true;
})



export default router; 