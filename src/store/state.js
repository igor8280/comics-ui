import merge from 'lodash/merge';

export const STORAGE_KEY = 'ui-starter';

// initial state
const STATE = {
	// local key will be stored to localStorage
	local: {
		user: null,
		isNavCollapse: false,
		isNavDrawerOpen: false,
		data: {},	// data object here will be stored components data (page limit, sort, ...)
		language: 'en'	// application language
	},
	// session key will be stored to sessionStorage
	session: {
		data: {}	// data object here will be stored components data (search, form data, ...)
	}
};

// get previous state from localStorage and sessionStorage
let localState = JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
let sessionState = JSON.parse(sessionStorage.getItem(STORAGE_KEY)) || {};

// merge previous state with initial state
merge(STATE.local, localState);
merge(STATE.session, sessionState);

export default STATE;
