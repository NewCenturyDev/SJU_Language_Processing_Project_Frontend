import { createRouter, createWebHashHistory } from 'vue-router';

// 1. Define route components.
import HomeView from '@/components/HomeView';


// 2. Define some routes
const routes = [
    { name: '/', path: '/', component: HomeView},
    // { name: '/admin', path: '/admin', component: AdminView, props: true},
];

const router = createRouter({
    // 4. Provide the history implementation to use. We are using the hash history for simplicity here.
    history: createWebHashHistory(),
    routes: routes,
    scrollBehavior () {
        return {left: 0, top: 0}
    },
});

export default router;
