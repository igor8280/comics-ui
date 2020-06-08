<template>
	<layout-main>
		<template v-slot:title>
			Starter Management
		</template>
		<div>
			<div class="level">
				<div class="level-left"></div>
				<div class="level-right">
					<b-button type="is-success" size="is-small" icon-right="plus" @click="$router.push('/starter/create')"/>
				</div>
			</div>
			<b-table :data="data"
					backend-sorting
					:default-sort="$utils.tableSort(sortBy)"
					@sort="(field, order) => $utils.changeSort(field, order, getStarters)"
					:loading="loading"
					bordered narrowed striped >
				<template slot-scope="props">
					<b-table-column field="title" label="Title" sortable>
						{{props.row.title}}
					</b-table-column>
					<b-table-column field="brand" label="Brand" width="200" sortable>
						{{props.row.brand}}
					</b-table-column>
					<b-table-column field="price" label="Price" width="100" sortable>
						{{props.row.price}}
					</b-table-column>
					<b-table-column field="age" label="Age" width="100" sortable>
						{{props.row.age}}
					</b-table-column>
					<b-table-column width="80" centered label="Actions">
						<div class="buttons">
							<b-button type="is-warning" size="is-small" icon-right="edit" @click="$router.push('/starter/' + props.row._id)"/>
							<b-button type="is-danger" size="is-small" icon-right="trash" @click="remove(props.row)" />
						</div>
					</b-table-column>
				</template>
			</b-table>
			<pagination v-model="pagination" @input="getStarters" ref="pagination"/>
		</div>
	</layout-main>
</template>

<script>
export default {
	name: 'starter-list',
	data() {
		return {
			data: [],
			pagination: this.$utils.defaultPagination(),
			sortBy: 'title',
			loading: false
		};
	},
	mounted() {
		// load previous component state if exist
		this.$utils.autoLoad();
		// collect data for table
		this.getStarters();
	},
	methods: {
		async getStarters() {
			// show loading spinner
			this.loading = true;
			// get parameters for get request
			let params = this.$utils.getParams();
			// get starter data
			let [data] = await this.$api.starter.$get(params);
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
		remove(record) {
			this.$buefy.dialog.confirm({
				title: 'Delete',
				message: 'Do you want to delete: ' + record.title,
				type: 'is-danger',
				onConfirm: () => {
					// show loading spinner
					this.loading = true;
					// send delete request
					this.$api.starter.$deleteOne({id: record._id});
					// hide loading spinner
					this.loading = false;
				}
			});
		}
	}
};
</script>
