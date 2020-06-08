import Vue from 'vue';
import VueRouter from 'vue-router';
import routes from './routes';
import store from '../store';

// install VueRouter
Vue.use(VueRouter);

// create router
const router = new VueRouter({
	mode: 'history',
	base: process.env.BASE_URL,
	routes
});

router.beforeEach((to, from, next) => {
	// protect routes from unauthorized users
	if (to.meta.requiresAuth !== false && !store.getters.user)
		// redirect user to login page
		next('/login');
	else
		// allow next route
		next();
});

export default router;
