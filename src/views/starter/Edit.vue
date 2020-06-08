<template>
	<layout-edit ref="page" :form="form" :submit="submit">
		<template v-slot:title-create>
			Create Starter
		</template>
		<template v-slot:title-update>
			Update Starter
		</template>
		<ValidationObserver tag="div" class="columns" ref="form">
			<div class="column is-one-third">
				<ValidationProvider rules="required" v-slot="{errors}" name="Title">
					<b-field label="Title"
						:type="{'is-danger': errors.length}"
						:message="errors">
						<b-input v-model="data.title" />
					</b-field>
				</ValidationProvider>
				<b-field label="Brand">
					<b-input v-model="data.brand" />
				</b-field>
				<b-field label="Price">
					<b-input v-model="data.price" />
				</b-field>
				<b-field label="Age">
					<b-input v-model="data.age" />
				</b-field>
			</div>
		</ValidationObserver>
		<b-loading :active="loading" />
	</layout-edit>
</template>

<script>
import {ValidationProvider, ValidationObserver} from 'vee-validate';
export default {
	name: 'starter-edit',
	data() {
		return {
			id: this.$route.params.id,
			form: this.$utils.getFormType(),
			data: {
				title: '',
				brand: '',
				price: '',
				age: 0
			},
			loading: false
		};
	},
	mounted() {
		if (this.form.edit)
			this.getData();
	},
	methods: {
		async getData() {
			let [data] = await this.$api.starter.$get({id: this.id});
			if (data)
				this.data = data;
		},
		async submit() {
			// show loading spinner
			this.loading = true;
			// if valid, execute create or update
			if (await this.$refs.form.validate())
				await (this.form.create ? this.create() : this.update());
			// hide loading spinner
			this.loading = false;
		},
		async create() {
			await this.$api.starter.$save(this.data);
		},
		async update() {
			await this.$api.starter.$update({id: this.id}, this.data);
		}
	},
	components: {
		ValidationProvider,
		ValidationObserver
	}
};
</script>
