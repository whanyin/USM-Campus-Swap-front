import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'

const routes = [
    {
        path: '/',
        name: 'Home',
        component: Home
    },
    {
        path: '/goods/:id',
        name: 'GoodsDetail',
        component: () => import('../views/GoodsDetails.vue')
    },
    {
        path: '/sell',
        name: 'Sell',
        component: () => import('../views/Sell.vue')
    },
    {
        path: '/my-products',
        name: 'MyProducts',
        component: () => import('../views/MyProducts.vue')
    },
    {
        path: '/my-wishlist',
        name: 'MyWishlist',
        component: () => import('../views/Wishlist.vue')
    },
    {
        path: '/orders',
        name: 'Orders',
        component: () => import('../views/Orders.vue')
    },
    {
        path: '/help',
        name: 'Help',
        component: () => import('../views/Help.vue')
    },
    {
        path: '/messages',
        name: 'Messages',
        component: () => import('../views/Messages.vue')
    },
    {
        path: '/profile',
        name: 'Profile',
        component: () => import('../views/Profile.vue')
    },
    {
        path: '/login',
        name: 'Login',
        component: () => import('../views/Login.vue')
    },
    {
        path: '/register',
        name: 'Register',
        component: () => import('../views/Register.vue')
    },
    {
        path: '/payment',
        name: 'Payment',
        component: () => import('../views/Payment.vue')
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router