<template>
	<layout-main>
		<template v-slot:title>
			User Management
		</template>
		<div class="section">
			<div class="level">
				<div class="level-left columns">
					<div class="column">
						<b-field label="Trazenje po email-u">
							<b-input class="fixed-width-250" v-model="parametri.email" v-on:keypress.enter.native="getUsers"></b-input>
						</b-field>
					</div>
				</div>
				<div class="level-right">
					<b-button v-if="access==='RW'" type="is-success" size="is-small" icon-right="plus" @click="$router.push('/users/create')">Dodaj</b-button>
				</div>
			</div>
			<b-table :data="data"
					backend-sorting
					:default-sort="$utils.tableSort(sortBy)"
					@sort="(field, order) => $utils.changeSort(field, order, getUsers)"
					:loading="loading"
					bordered narrowed striped>
				<template slot-scope="props">
					<b-table-column field="email" label="Username / email" sortable>
						{{props.row.email}}
					</b-table-column>
					<b-table-column field="nickname" label="Nickname" sortable>
						{{props.row.nickname}}
					</b-table-column>
					<b-table-column field="access" label="Access" width="200" sortable>
						{{props.row.access}}
					</b-table-column>
					<b-table-column width="100" centered label="Actions" v-if="access==='RW'">
						<div class="buttons">
							<b-button type="is-warning" size="is-small" icon-right="edit" @click="$router.push('/users/' + props.row._id)"/>
							<b-button type="is-danger" size="is-small" icon-right="trash" @click="remove(props.row)" />
						</div>
					</b-table-column>
				</template>
			</b-table>
			<pagination v-model="pagination" @input="getUsers" ref="pagination"/>
		</div>
	</layout-main>
</template>

<script>
export default {
	name: 'user-list',
	data() {
		return {
			data: [],
			loading: false,
			pagination: this.$utils.defaultPagination(),
			sortBy: 'email',
			access: JSON.parse(this.$store.getters.user).user.access,
			parametri: {
				email: null
			}
		};
	},
	mounted() {
		// collect data for table
		this.getUsers();
	},
	methods: {
		async getUsers() {
			// show loading spinner
			this.loading = true;
			// get parameters for get request
			let params = this.$utils.getParams();

			if (this.parametri.email)
				params.email = this.parametri.email;

			// get character comics
			let [data] = await this.$api.users.$get(params);
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
		}
	}
};
</script>

<style scoped>

</style>
