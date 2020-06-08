import Vue from 'vue';
import VueResource from 'vue-resource';
import actions from './actions';

Vue.use(VueResource);

// all resources in format name: path
const resources = {
	login: '/login',
	starter: '/api/starter/{id}',
	comics: '/api/comics/{char}',
	comicsChar: '/api/comics/character/{char}/{id}',
	users: '/api/users/{id}',
	register: '/api/users/register',
	collections: '/api/collections/character/{char}/user/{user}/collection/{id}',
	rooms: '/api/rooms'
};

// prefix that will be added to resources path
const prefix = '/proxy';

// convert resource paths from strings to resource objects
for (let [name, path] of Object.entries(resources))
	resources[name] = Vue.resource(prefix + path);

export default {
	/**
	 * Install resources
	 * after installation resources can be accessed from any component for example: this.$api.someResource.get()
	 * resource contain all standard methods from vue-resource plugin + user defined methods
	 * @param Vue {Object}
	 * @returns {Void}
	 */
	install(Vue) {
		// $this is variable that should hold Vue instance
		let $this;
		// loop trough all resources
		for (let key in resources) {
			// loop trough all custom actions
			for (let method in actions)
				// create wrapper for custom methods and add it to resource object
				// wrapper will call original action with predefined first two parameters:
				// 1) resources[key] = requested resource object with default and custom actions
				// 2) $this = Vue component
				resources[key][method] = (...args) => actions[method](resources[key], $this, ...args);
		}
		// add $api as getter on Vue prototype
		Object.defineProperty(Vue.prototype, '$api', {
			get() {
				// this is Vue instance that is calling $api resource
				$this = this;
				// return resource object
				return resources;
			}
		});
	}
};
