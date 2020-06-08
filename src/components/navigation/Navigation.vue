<template>
	<b-menu class="navigation" :accordion="false">
		<b-menu-list>
			<b-menu-item v-for="item in navigation"
				:icon="item.icon"
				:key="item.path"
				:active="item.path === $route.path"
				:expanded="item.expanded"
				@click="item.expanded = !item.expanded, selectMenu(item.path)">
				<template slot="label" slot-scope="props">
					{{item.label}}
					<b-icon
						v-if="item.children && item.children.length"
						class="is-pulled-right"
						:icon="props.expanded ? 'caret-down' : 'caret-up'">
					</b-icon>
				</template>
				<template v-if="item.children">
					<b-menu-item v-for="subItem in item.children"
						:icon="subItem.icon"
						:key="subItem.path"
						:active="subItem.path === $route.path"
						:expanded="subItem.expanded"
						@click="subItem.expanded = !subItem.expanded">
						<template slot="label" slot-scope="props">
							{{subItem.label}}
							<b-icon
								v-if="subItem.children && subItem.children.length"
								class="is-pulled-right"
								:icon="props.expanded ? 'caret-down' : 'caret-up'">
							</b-icon>
						</template>
						<template v-if="subItem.children">
							<b-menu-item v-for="subSubItem in subItem.children"
								:label="subSubItem.label"
								:icon="subSubItem.icon"
								:active="subSubItem.path === $route.path"
								:key="subSubItem.path">
							</b-menu-item>
						</template>
					</b-menu-item>
				</template>
			</b-menu-item>
		</b-menu-list>
	</b-menu>
</template>

<script>
export default {
	name: 'navigation',
	props: {
		mode: {
			type: String,
			default: 'vertical'
		}
	},
	data() {
		return {
			navigation: [
				{
					label: 'Home',
					path: '/',
					icon: 'fas fa-home'
				},
				// {
				// 	label: 'Starter',
				// 	path: '/starter'
				// },
				// {
				// 	label: 'Chat',
				// 	path: '/chat'
				// },
				{
					label: 'Stripovi',
					path: '/comics'
				},
				{
					label: 'Users',
					path: '/users'
				}
			]
		};
	},
	methods: {
		selectMenu(path) {
			// if path is changed and doesn't start with #
			if (path !== this.$route.path && !/^#/.test(path)) {
				// hide nav drawer
				this.$store.commit('setNavDrawer', false);
				// go to selected path
				this.$router.push(path);
			}
		}
	}
};
</script>

<style lang="scss">
	.navigation {
		height: 100%;
	}
</style>
