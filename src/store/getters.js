// return user data
export const user = state => state.local.user;

// return application language
export const language = state => state.local.language;

// return components data from local and session data objects
export const data = state => key => {
	return {
		local: state.local.data[key],
		session: state.session.data[key]
	};
};

// check if nav is collapsed
export const isNavCollapse = state => state.local.isNavCollapse;
// check if nav drawer is open
export const isNavDrawerOpen = state => state.local.isNavDrawerOpen;
