import { createRouter, createWebHashHistory } from 'vue-router';

// 1. Define route components.
import HomeView from '@/components/main/HomeView';
import ConsoleView from '@/components/console/ConsoleView';


// 2. Define some routes
const routes = [
    { name: '/', path: '/', component: HomeView},
    { name: '/console', path: '/console', component: ConsoleView, props: true},
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
