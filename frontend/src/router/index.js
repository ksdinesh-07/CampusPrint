import {createRouter,createWebHistory} from 'vue-router';

import OAuthSuccess from '../views/OAuthSuccess.vue';
import LoginView from '../views/LoginView.vue';
import RegisterView from '../views/RegisterView.vue';
import { is_authenticated } from '../utils/auth.js';


//Student pages
import StudentDashboard from '../views/student/StudentDashboard.vue';

import NewOrderView from '../views/student/NewOrderView.vue';
import OrdersView from '../views/student/OrdersView.vue';
import OrderDetailsView from '../views/student/OrderDetailsView.vue';
import PaymentsView from '../views/student/PaymentsView.vue';
import ProfileView from '../views/student/ProfileView.vue';

const routes=[

    //Authentication
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
        path:'/oauth-success',
        name:'oauth-success',
        component:OAuthSuccess
    },

    //student pages
    {
        path:'/student/dashboard',
        name:'student-dashboard',
        component:StudentDashboard
    },
    {
        path:'/student/new-order',
        name:'student-new-order',
        component:NewOrderView
    },
    {
        path:'/student/orders',
        name:'student-order',
        component:OrdersView
    },
    {
        path:'/student/orders/:id',
        name:'Student-order-details',
        component:OrderDetailsView
    },
    {
        path:'/student/payments',
        name:'student-payments',
        component:PaymentsView
    },
    {
        path:'/student/profile',
        name:'student-profile',
        component:ProfileView
    },




    {
        path:'/staff/dashboard',
        name:'staff-dashboard',
        component:()=> import ('../views/staff/StaffDashboard.vue')
    },
    {
        path:'/admin/dashboard',
        name:'admin-dashboard',
        component:()=> import ('../views/admin/AdminDashboard.vue')
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