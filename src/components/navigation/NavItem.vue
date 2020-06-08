<template>
	<b-menu-item
		:icon="value.icon"
		:label="value.label"
		:active="$route.path === value.path"
		:key="value.path">
		<template v-if="value.children && value.children.length">
			<nav-item v-for="(item, i) in value.children" :value="item" :key="i"/>
		</template>
	</b-menu-item>
</template>

<script>
export default {
	name: 'nav-item',
	props: {
		value: Object
	}
};
</script>
