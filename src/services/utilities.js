import _ from 'lodash';

const utils = {
	/**
	 * default value for pagination
	 * @returns {Object}
	 */
	defaultPagination() {
		return {
			page: 1,
			limit: 10,
			total: 0
		};
	},
	/**
	 * set component pagination data
	 * @param page
	 * @param limit
	 * @param total
	 */
	setPagination({page, limit, total}) {
		this.pagination = {page, limit, total};
	},
	/**
	 * return object with common parameters for get request
	 * parameters that will be returned if exists:
	 * 		page and limit from pagination object
	 * 		sortBy
	 * 		search
	 * @returns {Object}
	 */
	getParams() {
		return _.omitBy(
			_.assign(
				_.pick(this, ['sortBy', 'search']),
				_.pick(this.pagination, ['limit', 'page'])
			), _.isNull);
	},
	/**
	 * set pagination page to 1 and call function to get data
	 * @param fn {Function}
	 */
	search(fn) {
		this.pagination.page = 1;
		return fn();
	},
	/**
	 * convert sortBy string to object with prop and order properties
	 * @param sortBy
	 * @returns {{prop: string|null, order: string|null}}
	 */
	tableSort(sortBy) {
		console.log('SORT', sortBy);
		if (_.isString(sortBy)) {
			return [
				_.trimStart(sortBy, '-'),
				_.startsWith(sortBy, '-') ? 'desc' : 'asc'
			];
		}
	},
	/**
	 * change sortBy property when table sort change and execute callback function
	 * @param prop {String}
	 * @param order {String|Null}
	 * @param cb {Function}
	 */
	changeSort(prop, order, cb) {
		// set sortBy component property
		this.sortBy = (order === 'desc' ? '-' : '') + prop;
		// execute callback function
		cb();
	},
	/**
	 * return object with two boolean props create and edit
	 * @param routeParam {String} route parameter to check
	 * @returns {{edit: boolean, create: boolean}}
	 */
	getFormType(routeParam = 'id') {
		let create = this.$route.params[routeParam] === 'create';
		return {
			create,
			edit: !create
		};
	},
	/**
	 * splice element from array
	 * @param array
	 * @param index
	 * @param number
	 */
	splice(array, index, number = 1) {
		array.splice(index, number);
	},
	/**
	 * auto collect, arrange and save data in store
	 * this function is trying to collect:
	 *		pagination
	 *		sortBy,
	 *		search,
	 *		filter,
	 *		data
	 *		session
	 * from component data object
	 * @param {String} key location name where to store data
	 */
	autoSave(key) {
		// if key is not set use component name as key
		if (!key) key = this.$options.name;

		// data for localStorage
		let local = _.pick(this, ['pagination.limit', 'sortBy']);
		// data for sessionStorage
		let session = _.pick(this, ['pagination.page', 'pagination.total', 'search', 'filter', 'data', 'session']);

		// save collected data
		this.$store.commit('setData', {key, local, session});
	},
	/**
	 * auto collect and load data in vue component
	 * @param {String} key
	 */
	autoLoad(key) {
		// if key is not set use component name as key
		if (!key) key = this.$options.name;

		// get local and session data
		let {local, session} = this.$store.getters.data(key);

		// load local and session data to vue component
		_.merge(this, local, session);
	},
	/**
	 * validate form using promise and return array with two values [valid, errors]
	 * @param ref {String|Object} ref name as string or vue ref
	 * @returns {Promise<unknown>}
	 */
	validateForm(ref = 'form') {
		// create new promise
		return new Promise(resolve => {
			// if ref is string convert it to vue ref
			if (_.isString(ref))
				ref = this.$refs[ref];
			// call validate with callback function to get validation status end errors
			ref.validate((valid, errors) => {
				resolve([valid, errors]);
			});
		});
	},
	/**
	 * show message to user
	 * @param {Object} alert https://buefy.org/documentation/dialog
	 */
	showMessage(alert) {
		this.$buefy.dialog.alert({
			hasIcon: true,
			icon: 'times-circle',
			iconPack: 'fas',
			ariaModal: true,
			...alert
		});
	},
	/**
	 * show message to user
	 * default message type is success
	 * @param {Object} message http://element.eleme.io/#/en-US/component/message
	 */
	showResponse(response) {
		this.$message({
			type: 'success',
			message: response.body.message
		});
	},
	/**
	 * browser history go back
	 * @param {Object} message show message
	 */
	goBack(message = null) {
		return this.$store.dispatch('goBack').then(route => {
			if (message) this.$utils.showMessage(message);

			this.$router.replace(route);
		});
	},
	/**
	 * save current route and go to next (path)
	 * @param path {String}
	 */
	goTo(path) {
		this.$store.commit('saveRoute', this.$route.fullPath);
		this.$store.commit('goTo', path);
		this.$router.push(path);
	},
	/**
	 * handling response errors
	 * @param {Object} error
	 */
	handleResponseError(error) {
		// validate passed parameter
		if (error && error.constructor.name === 'Response') {
			// if error is 401, clear error object to stop further error handling
			if (utils.isSessionExpired.call(this, error))
				error = null;
			else {
				// use http status name as error title
				let title = error.statusText;
				// get message from body
				let {message} = error.body;
				// if message doesnt exist
				if (!message)
					message = 'Server not responding.';

				this.$utils.showMessage({
					type: 'is-danger',
					title,
					message
				});
			}
		}
		return error;
	},
	isSessionExpired(error) {
		if (error.status === 401 && this.$route.path !== '/login') {
			this.$router.replace('/login');
			utils.showMessage.call(this, {
				type: 'is-warning',
				title: 'Unauthorized',
				message: 'Your session has expired due to inactivity.'
			});
			return true;
		}
		return false;
	},
	/**
	 * set loading to false after all functions are finished
	 * @param array
	 * @returns {Promise<any[]>}
	 */
	stopLoadingAfter(array) {
		this.$store.commit('setLoading', true);
		return Promise.all(array).then(result => {
			this.$nextTick(() => {
				this.$store.commit('setLoading', false);
			});
			return result;
		}).catch(() => {
			this.$nextTick(() => {
				this.$store.commit('setLoading', false);
			});
		});
	},
	/**
	 * return string in format DD/MM/YYYY
	 * @param date - string or Date Object
	 * @returns {String}
	 */
	printDate(date) {
		if (!date) return '';

		if (typeof date === 'string') date = new Date(date);

		let year = date.getFullYear();
		let month = ('0' + (date.getMonth() + 1)).slice(-2);
		let day = ('0' + date.getDate()).slice(-2);

		return `${day}/${month}/${year}`;
	},
	/**
	 * moment date format function
	 * @param date [ new Date() ]
	 * @param fomat [ YYYY-MM-DD HH:mm:ss ]
	 * @returns {string}
	 */
	formatDate(date, fomat) {
		return this.moment(date).format(fomat);
	},
	/**
	 * save first form value (unchanged data) in sessionStorage
	 * @param value
	 * @param overwrite {Boolean} should data be overwritten if key already exist
	 */
	saveOriginalData(value, overwrite = false) {
		let key = `originalData-${this.$options.name}`;
		if (overwrite || !this.$store.getters.session[key]) {
			this.$store.commit('saveSession', {
				key,
				value: JSON.parse(JSON.stringify(value))
			});
		}
	},
	/**
	 * Format Date with timezone offset
	 * @param date
	 * @param utcOffset
	 * @param toString
	 * @returns {*}
	 */
	dateUtcTime(date, utcOffset = true, toString = true) {
		// Get utc offset time in minutes
		let offset = this.moment(date).utcOffset();
		if (!date) return null;

		if (utcOffset) {
			if (toString) return this.moment(date).add(-offset, 'minutes').utc().toISOString(); // add minutes and format date
			else return this.moment(date).add(-offset, 'minutes').utc(); // add mintes
		}
		else {
			if (toString) return this.moment(date).utc().toISOString(); // without add utc offset format date
			else return this.moment(date).utc(); // without add utc offset
		}
	},
	/**
	 * set sort manually
	 * @param sort {String}	prop,order
	 * @param view {String} current display (table,grid...)
	 * @param cb {Function} callback function
	 */
	setSort(sort, view, cb) {
		let [prop, order] = sort.split(',');

		// sort by relevance score
		if (prop === 'null') {
			prop = null;
			order = null;
		}

		this.sortBy = {prop, order};

		// to solve the problem with icons for sorting (triangles)
		// table component must be forced to render again
		if (this[view] === 'table') {
			let mutation = 'set' + view[0].toUpperCase() + view.slice(1); // assetDisplay -> setAssetDisplay
			this.$store.commit(mutation, 'tableReload');
			this.$nextTick(() => {
				this.$store.commit(mutation, 'table');
			});
		}
		cb();
	},
	/**
	 * copy props from one object to another
	 * @param props {Array} array of property names
	 * @param source {Object}
	 * @param destination {Object}
	 */
	copyPropsFromTo(props, source, destination) {
		props.forEach(prop => {
			if (source.hasOwnProperty(prop)) destination[prop] = source[prop];
		});
	}
};

export default {
	/**
	 * Install utilities
	 * after installation utility methods can be called from any component for example: this.$utils.someMethod();
	 * and someMethod will inherit context from component
	 * @param {Object} Vue
	 * @returns {Void}
	 */
	install(Vue) {
		// $this is variable that should hold Vue instance
		let $this;
		// $utils is wrapper for all utils methods
		let $utils = {};
		// loop trough each key/value of original utils object
		for (let [key, value] of Object.entries(utils)) {
			// define wrapper function with same key
			$utils[key] = (...args) => {
				// execute original utils function with changed context and return result
				// $this is Vue instance that called this method
				return value.call($this, ...args);
			};
		}
		// add $utils as getter on Vue prototype
		Object.defineProperty(Vue.prototype, '$utils', {
			get() {
				// this is Vue instance that is calling $utils methods
				$this = this;
				// return wrapper functions
				return $utils;
			}
		});
	}
};
