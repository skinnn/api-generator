<template>
	<div class="login-form">
		<form @submit="handleLogin">
			<div class="form-row">
				<div class="form-group">
					<label for="username">Username</label>
					<input type="text" id="username"
						:class="['form-control', {'is-invalid': error}]"
						v-model="fields.username"
						required
					>
					<!-- <div class="invalid-feedback">
						Username or password is not correct.
					</div> -->
				</div>
			</div>
			<div class="form-row">
				<div class="form-group">
					<label for="password">Password</label>
					<input type="password" id="password"
						:class="['form-control', {'is-invalid': error}]"
						v-model="fields.password"
						required
					>
					<div class="invalid-feedback">
						{{ error }}.
					</div>
				</div>
			</div>

			<button type="submit" class="btn btn-primary">Login</button>
		</form>
	</div>
</template>

<script>
// Services
import AuthService from '@/services/Authentication.js';

export default {
	name: 'LoginForm',

	data() {
		return {
			fields: {
				username: '',
				password: ''
			},
			error: null
		};
	},

	methods: {
		async handleLogin() {
			try {
				event.preventDefault();
				const data = {
					username: this.fields.username,
					password: this.fields.password
				};
				const res = await AuthService.login(data);
				const { token, userId } = res;
				// Save user data
				this.$store.dispatch('user/loginUser', { userId, token });
				this.$router.push({ name: 'home' });
			} catch (err) {
				this.error = err.response.data.message;
				console.error(err.response);
			}
		}
	}
};
</script>

<style scoped lang="scss">
	.login-form {

		.form-group {
			width: 100%;
		}
	}
</style>