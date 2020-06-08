<template>
	<section class="columns">
		<aside v-if="$vssWidth > 768"
				class="column is-narrow"
				style="width: 200px">
			<navigation />
		</aside>
		<sidebar v-else ref="sidebar" />
		<section class="column">
			<header class="level">
				<div class="level-left">
					<b-icon v-if="$vssWidth <= 768" icon="fas fa-bars" @click.native="openSidebar" />
					<slot name="title"></slot>
				</div>
<!--				<div class="level-right">-->
<!--					<app-language />-->
<!--				</div>-->
			</header>
			<main class="columns">
				<div class="column">
					<slot></slot>
				</div>
			</main>
		</section>
	</section>
</template>

<script>
export default {
	name: 'layout-main',
	methods: {
		openSidebar() {
			this.$refs.sidebar.open = true;
		}
	},
	components: {
		navigation: require('../navigation/Navigation').default,
		// appLanguage: require('../AppLanguage').default,
		sidebar: require('../navigation/Sidebar').default
	}
};
</script>
