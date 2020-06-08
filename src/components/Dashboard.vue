<template>
    <div class="page"></div>
</template>

<script>
export default {
	name: 'Dashboard',

	mounted() {
		this.$store.dispatch('setHeaderMain', {
			title: 'Dashboard',
			loading: false
		});
	}
};
</script>
