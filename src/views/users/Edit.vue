<template>
	<div class="section columns">
			<div class="column is-one-quarter">

				<div class="field">
					<label class="label">Username</label>
					<div class="control">
						<input  class="input" type="text" v-model="user.email" placeholder="Email">
					</div>
				</div>

				<div class="field">
					<label class="label">Nickname</label>
					<div class="control">
						<input type="text" class="input" v-model="user.nickname" placeholder="Nickname">
					</div>
				</div>

				<div class="field" v-if="$route.params.id === 'create'">
					<b-field label="Password">
						<b-input type="password" v-model="user.password" />
					</b-field>
				</div>

				<div class="field">
					<label class="label">Access rights</label>
					<div class="control">
						<b-field>
							<b-select class="fixed-width-250" placeholder="Access rights" v-model="user.access">
								<option
									v-for="access in accessRights"
									:value="access.key"
									:key="access.key">
									{{ access.val }}
								</option>
							</b-select>
						</b-field>
					</div>
				</div>

				<b-field grouped>
					<b-button v-if="$route.params.id==='create'" class="fixed-width-100" type="is-success" v-on:click="create">Submit</b-button>
					<b-button v-if="$route.params.id!=='create'" class="fixed-width-100" type="is-success" v-on:click="update">Update</b-button>
					<b-button class="fixed-width-100" type="is-warning" v-on:click="goBack">Back</b-button>
				</b-field>
			</div>
		</div>
</template>

<script>
export default {
	name: 'user-edit',
	data() {
		return {
			user: {
				email: null,
				nickname: null,
				password: null,
				access: null
			},
			accessRights: [{key: 'R', val: 'Read'}, {key: 'RW', val: 'Read/Write'}],
			id: null
		};
	},
	mounted() {
		// set id
		this.id = this.$route.params.id;

		// get user data
		if (this.id !== 'create')
			this.getUser();
	},
	methods: {
		async getUser() {
			// show loading spinner
			this.loading = true;
			// get parameters for get request
			let params = {
				id: this.$route.params.id
			};

			// get starter data
			let [data] = await this.$api.users.$get(params);
			if (data) {
				// set data for editing
				this.user = data;
				console.log('user', this.user);
				// save current component state
				this.$utils.autoSave();
			}
			// hide loading spinner
			this.loading = false;
		},
		goBack() {
			this.$router.go(-1);
		},
		async create() {
			await this.$api.users.$save(this.user);
		},
		async update() {
			await this.$api.users.$update({id: this.id}, this.user);
		}
	}
};
</script>

<style scoped>

</style>
