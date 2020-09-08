<template>
	<button @click="handleLogout()" class="logout-button">Logout</button>
</template>

<script>
// Services
import AuthService from '@/services/Authentication.js';

export default {
	name: 'LogoutButton',

	methods: {
		async handleLogout() {
			try {
				await AuthService.logout();
				// Remove user data
				this.$store.dispatch('user/logout');
				// Redirect
				this.$router.push({ name: 'login' });
			} catch (err) {
				console.error(err);
			}
		}
	}
};
</script>

<style scoped lang="scss">
.logout-button {
	border: 1px solid $dark-grey;
	border-radius: 5px;
	padding: 2px 10px;
	&:hover {
		background-color: lighten($dark-grey, 50%);
	}
}
</style>