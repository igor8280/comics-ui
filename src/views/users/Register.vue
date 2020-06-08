<template>
	<div class="columns is-centered is-vcentered page-login">
		<div class="column is-one-third panel">
			<p class="panel-heading">
				Kreiraj novog korisnika
			</p>
			<ValidationObserver tag="div" class="column panel-block" ref="form">
				<ValidationProvider rules="required|email" v-slot="{errors}" name="Unesite email">
					<b-field label="Email"
						:type="{'is-danger': errors.length}"
						:message="errors">
						<b-input type="email" v-model="credentials.email" />
					</b-field>
				</ValidationProvider>
				<ValidationProvider rules="required" v-slot="{errors}" name="Unesite nadimak">
					<b-field label="Nadimak"
							:type="{'is-danger': errors.length}"
							:message="errors">
						<b-input type="text" v-model="credentials.nickname" />
					</b-field>
				</ValidationProvider>
				<ValidationProvider rules="required|lozinka:@potvrda" v-slot="{errors}" name="lozinka">
					<b-field label="Lozinka"
						:type="{'is-danger': errors.length}"
						:message="errors">
						<b-input type="password" v-model="credentials.password" />
					</b-field>
				</ValidationProvider>
				<ValidationProvider rules="required" v-slot="{errors}" name="potvrda">
					<b-field label="Potvrdi lozinku"
						:type="{'is-danger': errors.length}"
						:message="errors">
						<b-input type="password" v-model="credentials.password_confirm" />
					</b-field>
				</ValidationProvider>
				<div class="columns">
					<div class="column has-text-centered" >
						<b-button type="is-warning" @click="register">Registruj se</b-button>
					</div>
				</div>
			</ValidationObserver>
		</div>
	</div>
</template>

<script>
import {ValidationProvider, ValidationObserver, extend} from 'vee-validate';
import _ from 'lodash';

extend('lozinka', {
	params: ['target'],
	validate(value, {target}) {
		return value === target;
	},
	message: 'Potvrdjena lozinka se ne slaze!'
});

export default {
	name: 'register',
	data() {
		return {
			credentials: {
				email: null,
				nickname: null,
				password: null,
				password_confirm: null
			},
			rules: {
				email: [{required: true, trigger: 'blur'}],
				nickname: [{required: true, trigger: 'blur'}],
				password: [{required: true, trigger: 'blur'}],
				password_confirm: [{required: true, trigger: 'blur'}]
			},
			loading: false
		};
	},
	methods: {
		async register() {
			if (await this.$refs.form.validate()) {
				try {
					// show loading spinner
					this.loading = true;
					// send registration request
					await this.$api.users.save(_.omit(this.credentials, ['password_confirm']));

					// redirect to home page
					this.$router.replace({path: '/login'});
				}
				catch (error) {
					console.log('error register', error);
					// hide loading spinner
					this.loading = false;
					// pass error to response error handler
					this.$utils.handleResponseError(error);
				}
			}
			else
				console.log('Forma nije validna!');
		}
	},
	components: {
		ValidationProvider,
		ValidationObserver
	}
};
</script>

<style scoped>

</style>
