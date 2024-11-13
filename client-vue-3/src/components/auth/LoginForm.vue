<script>
import { reactive } from 'vue';
import { useRouter } from 'vue-router';
import config from '@/config/master.js'
import { AuthApi } from '@/services/api';
import { useAuthStore } from '@/stores/auth';

export default {
  name: 'LoginForm',
  components: {  },
  // props: {
  //   test: String
  // },
  setup() {
    const authStore = useAuthStore();
    const router = useRouter();
    const state = reactive({
      fields: {
        username: '',
        password: '',
      },
      remember: false,
      error: ''
    })

    const handleFormSubmit = async (e) => {
			e.preventDefault();
			try {
				const credentials = {
					username: state.fields.username,
					password: state.fields.password,
				}
				// Login
				const res = await AuthApi.login(credentials);
				const data = res.data;
        console.log('data: ', data)
        // Remember me
				if (state.remember) {
					localStorage.setItem('remember', state.fields.username);
				} else {
					localStorage.removeItem('remember');
				}
				// Save user data to the store
				// $store.dispatch('user/login', { data.token });
        authStore.setToken(data.token)
				// Redirect
				router.push({ name: 'home' });
			} catch (err) {
        console.log('err: ', err)
				state.error = err.response.data.message;
				console.error(err.response);
			}
		}

    return {
      config,
      state,
      handleFormSubmit
    }
  }
}
</script>

<template>
  <div class="login-form">
		<div class="login-box">
			<header>
				<h2>{{ config.appName }}</h2>
			</header>
			<main>
				<form @submit="handleFormSubmit($event)">
					<input
						type="text"
						v-model="state.fields.username"
						:class="['form-control', { 'is-invalid': state.error }]"
						placeholder="Username"
						required
					/>
					<input
						type="password"
						v-model="state.fields.password"
						:class="['form-control', { 'is-invalid': state.error }]"
						placeholder="Password"
						required
					/>
					<div class="remember-wrapper">
						<input type="checkbox" id="remember" v-model="state.remember" />
						<label for="remember">Remember me</label>
					</div>
					<button type="submit">Login</button>
				</form>
			</main>
		</div>
		<div v-if="state.error" class="error-message">
			{{ state.error }}
		</div>
	</div>
</template>

<style lang="scss" scoped>
html,
body {
	min-height: 100%;
}

.login-box {
	max-width: 350px;
	margin: 0px auto;
	background-color: #276270;
	border-radius: 10px;
}
.login-box header {
	padding: 15px 30px;
	border-top-left-radius: 10px;
	border-top-right-radius: 10px;
	background-color: #f8f8f8;
}
.login-box header h2 {
	text-align: center;
	color: #276270;
}
.login-box header h2 small {
	font-size: 16px;
	opacity: 0.5;
}

.login-box main {
	padding: 20px 30px;
}

.login-box main input[type='text'],
.login-box main input[type='password'] {
	width: 100%;
	font-size: 15px;
	padding: 5px 10px;
	margin-bottom: 14px;
	border-radius: 10px;

	color: #fff;
	border: none;
	border-radius: 0;
	border-bottom: 2px solid #333;
	background-color: #276270;
	transition: background-color 150ms ease-in-out;
}
.login-box main input[type='text']::placeholder,
.login-box main input[type='password']::placeholder {
	color: #fff;
	font-size: 14px;
}
.login-box main input[type='text']:focus,
.login-box main input[type='password']:focus {
	outline: none;
	color: #333;
	background-color: #fff;
	border-top-left-radius: 5px;
	border-top-right-radius: 5px;
}

.login-box main button {
	width: 100%;
	margin: 20px 0 0 0;
	padding: 5px 25px;
	color: #fff;
	font-size: 16px;
	background-color: #333;
	border: none;
	border: 1px solid #fff;
	border-radius: 10px;
	transition: background-color 200ms ease-in-out;
	cursor: pointer;
}
.login-box main button:hover {
	background-color: #333;
}

.remember-wrapper {
	display: flex;
	align-items: center;
	margin-top: 10px;
}
.login-box main .remember-wrapper input[type='checkbox'] {
	display: inline-block;
	vertical-align: middle;
}
.login-box main .remember-wrapper label {
	font-size: 12px;
	color: #f4f4f4;
	font-weight: 600;
	height: 100%;
	vertical-align: middle;
	margin-bottom: 0;
	margin-left: 10px;
}

.error-message {
	display: block;
	max-width: 350px;
	padding: 10px 10px;
	margin: 15px auto 0 auto;
	text-align: center;
	font-size: 14px;
	background-color: red;
	color: #fff;
	border-radius: 10px;
}
.error-message:empty {
	display: none;
}
</style>
