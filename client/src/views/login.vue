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
