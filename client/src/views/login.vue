<template>
	<div class="login-page">
		<LoginForm />
	</div>
</template>

<script>
import LoginForm from '@/components/LoginForm.vue';

export default {
	name: 'Login',
	components: { LoginForm }
};
</script>

<style scoped>
.login-page {
	padding: 20vh;
	min-height: 100vh;
	background-color: #333;
	height: 100%;
}
</style>
