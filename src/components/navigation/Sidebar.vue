<template>
	<b-modal :active.sync="open" custom-class="sidebar-modal">
		<div class="sidebar-nav">
			<nav-main />
		</div>
	</b-modal>
</template>

<script>
export default {
	data() {
		return {
			open: false
		};
	},
	components: {
		navMain: require('./Navigation').default
	}
};
</script>

<style>
	.sidebar-modal {
		align-items: start;
		justify-content: start;
	}
	.sidebar-modal > .modal-content {
		margin: 0;
		width: min-content;
		height: 100%;
		max-height: 100%;
	}
	.sidebar-nav {
		width: 250px;
		height: 100%;
		background: white;
	}
</style>
