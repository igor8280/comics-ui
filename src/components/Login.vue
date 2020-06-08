<template>
	<div class="columns is-centered is-vcentered page-login">
		<div class="column is-one-third panel">
			<p class="panel-heading">
				Login
			</p>
			<ValidationObserver tag="div" class="column panel-block" ref="form">
				<ValidationProvider rules="required" v-slot="{errors}" name="Korisnicko ime">
					<b-field label="Email korisnika"
							:type="{'is-danger': errors.length}"
							:message="errors">
						<b-input v-model="credentials.email" />
					</b-field>
				</ValidationProvider>
				<ValidationProvider rules="required" v-slot="{errors}" name="Lozinka">
					<b-field label="Lozinka"
							:type="{'is-danger': errors.length}"
							:message="errors">
						<b-input type="password" v-model="credentials.password" />
					</b-field>
				</ValidationProvider>
				<div class="columns">
					<div class="column has-text-left" >
						<b-button type="is-primary" @click="login">Login</b-button>
					</div>
					<div class="column has-text-right" >
						<b-button type="is-warning" @click="register">Register</b-button>
					</div>
				</div>
			</ValidationObserver>
		</div>
	</div>
</template>

<script>
import {ValidationProvider, ValidationObserver} from 'vee-validate';
export default {
	name: 'login',
	data() {
		return {
			credentials: {
				email: '',
				password: ''
			},
			rules: {
				email: [{required: true, trigger: 'blur'}],
				password: [{required: true, trigger: 'blur'}]
			},
			loading: false
		};
	},
	mounted() {},
	methods: {
		async login() {
			if (await this.$refs.form.validate()) {
				try {
					// show loading spinner
					this.loading = true;
					// send login request
					await this.$api.login.save(this.credentials);
					// login was successful
					// read payload cookie
					let payload = this.$cookies.get('payload');
					// get user data from cookie
					let user = payload.split('.')[1];
					// decode base64 string
					user = atob(user);
					// update store
					this.$store.commit('setUser', user);
					// redirect to home page
					this.$router.replace({path: '/'});
				}
				catch (error) {
					// hide loading spinner
					this.loading = false;
					// pass error to response error handler
					this.$utils.handleResponseError(error);
				}
			}
		},
		register() {
			this.$router.push('/registracija/');
		}
	},
	components: {
		ValidationProvider,
		ValidationObserver
	}
};
</script>

<style>
	.page-login {
		height: 100vh;
	}
</style>
