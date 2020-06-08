// set user data
export const setUser = (state, value) => {
	state.local.user = value;
};

// set application language
export const setLanguage = (state, value) => {
	state.local.lang = value;
};

export const toggleNav = (state) => {
	state.local.isNavOpen = !state.local.isNavOpen;
	return state.local.isNavOpen;
};

export const toggleNavCollapse = state => {
	state.local.isNavCollapse = !state.local.isNavCollapse;
};

export const toggleNavDrawer = state => {
	state.local.isNavDrawerOpen = !state.local.isNavDrawerOpen;
};
export const setNavDrawer = (state, value) => {
	state.local.isNavDrawerOpen = value;
};

// set components data to local and session data objects
export const setData = (state, {key, local, session}) => {
	state.local.data[key] = local;
	state.session.data[key] = session;
};
