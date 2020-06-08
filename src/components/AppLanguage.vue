<template>
	<b-select v-model="language"
				@input="switchLocal">
		<option value="en">EN</option>
		<option value="rs">RS</option>
	</b-select>
</template>

<script>
export default {
	name: 'app-language',
	data() {
		return {
			language: this.$store.getters.language
		};
	},
	methods: {
		switchLocal(value) {
			// change element-ui language
			this.$i18n.locale = value;
			// change application language by updating store
			this.$store.commit('setLanguage', value);
		}
	}
};
</script>
