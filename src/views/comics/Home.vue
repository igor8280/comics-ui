<template>
	<layout-main>
		<div>Test Comics Home Page</div>
		<ul>
			<li v-for="item in data" :key="item._id">
				<img :src="item.url" alt="" v-on:click="listComics(item.lik)">
			</li>
		</ul>
	</layout-main>
</template>

<script>
export default {
	name: 'comics-home',
	data() {
		return {
			data: [],
			pagination: this.$utils.defaultPagination(),
			sortBy: 'lik',
			loading: false
		};
	},
	mounted() {
		// collect data for table
		this.getComics();
	},
	methods: {
		async getComics() {
			// show loading spinner
			this.loading = true;
			// get parameters for get request
			let params = this.$utils.getParams();
			// get starter data
			let [data] = await this.$api.comics.$get(params);

			if (data) {
				// set data for table
				this.data = data.content;
				// set pagination from response
				this.$utils.setPagination(data);
				// save current component state
				this.$utils.autoSave();
			}
			// hide loading spinner
			this.loading = false;
		},
		listComics(character) {
			this.$router.push('/comics/character/' + character);
		}
	}
};
</script>

<style scoped>
	img {
		cursor: pointer;
	}
</style>
