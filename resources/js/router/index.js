import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
    {
        path: '/home',
        name: 'home',
        component: require('../components/Home.vue').default,
    },
    {
        path: '/profile',
        name: 'profile',
        component: require('../components/Profile.vue').default,
    },
]

export default new VueRouter({
    mode: 'history',
    routes,
})