<template>
	<layout-main>
		<template v-slot:title>
			Home page
		</template>
		<div class="home">
			<img alt="Vue logo" src="../assets/logo.png">
			<HelloWorld msg="Welcome to Your Vue.js App"/>
		</div>
	</layout-main>
</template>

<script>
// @ is an alias to /src
import HelloWorld from '@/components/HelloWorld.vue';

export default {
	name: 'home',
	components: {
		HelloWorld
	}
};
</script>
<style lang="scss">
	.home {
		font-family: 'Avenir', Helvetica, Arial, sans-serif;
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
		text-align: center;
		color: #2c3e50;
	}
</style>
