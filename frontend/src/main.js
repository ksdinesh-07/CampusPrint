import { createApp } from 'vue'
import router from './router/index.js'
import App from './App.vue'
import './styles/global.css'
import './styles/auth.css'
import './styles/dashboard.css'
import './styles/navbar.css'
import './styles/sidebar.css'


createApp(App).use(router).mount('#app')
