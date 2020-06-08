<template>
	<section>
		<header class="columns">
			<div class="column level">
				<div class="level-left">
					<b-button
						size="is-small"
						icon-right="arrow-left"
						:disabled="disableCancel"
						@click="exitForm" />
					<!-- form title -->
					<slot v-if="form.create" name="title-create" />
					<slot v-else name="title-update" />
				</div>
			</div>
			<div class="level-right">
				<!-- form submit button -->
				<b-button
					size="is-small"
					type="is-success"
					:disabled="disableSubmit"
					@click="submitForm">
					{{form.create ? 'Create' : 'Update'}}
				</b-button>
			</div>
		</header>
		<main class="columns">
			<div class="column">
				<slot></slot>
			</div>
		</main>
	</section>
</template>

<script>
export default {
	name: 'layout-edit',
	props: {
		form: {
			type: Object,
			required: true
		},
		submit: Function,
		cancel: Function
	},
	data() {
		return {
			disableCancel: false,
			disableSubmit: false
		};
	},
	methods: {
		async exitForm() {
			// disable cancel button
			this.disableCancel = true;
			// execute cancel function if exist
			if (this.cancel)
				await this.cancel();
			else
				this.$router.go(-1);
			// enable cancel button, in case if user did not leave form
			this.disableCancel = false;
		},
		async submitForm() {
			// immediately disable submit button to prevent multiple submits
			this.disableSubmit = true;
			await this.submit();
			// enable submit button, in case if user did not leave form
			this.disableSubmit = false;
		}
	}
};
</script>
