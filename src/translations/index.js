import Vue from 'vue';
import VueI18n from 'vue-i18n';
import store from '../store';

// Translation for APP
import enLocale from './en';
import rsLocale from './rs';

const messages = {
	en: {
		...enLocale
	},
	rs: {
		...rsLocale
	}
};

Vue.use(VueI18n);

const i18n = new VueI18n({
	locale: store.state.local.lang, // set locale language
	fallbackLocale: 'en', // default (if there is no selected language)
	messages // set locale messages
});

export default i18n;
