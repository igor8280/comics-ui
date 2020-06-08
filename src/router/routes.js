import Home from '../views/Home.vue';
import Login from '../components/Login';
import Register from '../views/users/Register';
// import StarterList from '../views/starter/list';
// import StarterEdit from '../views/starter/edit';

// route definitions
// All routes by default have requiresAuth true
const routes = [
	{
		path: '/',
		name: 'home',
		component: Home
	},
	{
		path: '/login',
		name: 'Login.vue',
		component: Login,
		meta: {
			requiresAuth: false		// this route doesnt require authorization
		}
	},
	// {
	// 	path: '/chat',
	// 	name: 'chat',
	// route level code-splitting
	// this generates a separate chunk (about.[hash].js) for this route
	// which is lazy-loaded when the route is visited.
	// component: () => import(/* webpackChunkName: "about" */ '../views/Chat.vue')
	// },
	{
		path: '/comics',
		name: 'comics-home',
		component: () => import(/* webpackChunkName: "about" */ '../views/comics/Home.vue')
	},
	{
		path: '/comics/character/:char',
		name: 'comics-char',
		component: () => import(/* webpackChunkName: "about" */ '../views/comics/List')
	},
	{
		path: '/comics/character/:char/:id',
		name: 'comics-edit',
		component: () => import(/* webpackChunkName: "about" */ '../views/comics/Edit')
	},
	{
		path: '/users',
		name: 'user-list',
		component: () => import(/* webpackChunkName: "about" */ '../views/users/List.vue')
	},
	{
		path: '/users/:id',
		name: 'user-edit',
		component: () => import(/* webpackChunkName: "about" */ '../views/users/Edit.vue')
	},
	{
		path: '/registracija',
		name: 'register',
		meta: {
			requiresAuth: false		// this route doesnt require authorization
		},
		component: Register
	}
];

export default routes;
