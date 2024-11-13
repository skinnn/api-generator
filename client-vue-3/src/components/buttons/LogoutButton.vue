<script>
export default {
	name: 'LogoutButton',
  setup() {
    const handleLogout = () => {
      console.log('handleLogout')
			// try {
			// 	this.$http.authentication.logout();
			// } catch (err) {
			// 	console.error(err);
			// } finally {
			// 	// Remove user data
			// 	this.$store.dispatch('user/logout');
			// 	// Redirect
			// 	this.$router.push({ name: 'login' });
			// }
		}

    return {
      handleLogout
    }
  }
};
</script>

<template>
	<button @click="handleLogout()" class="logout-button">Logout</button>
</template>

<style lang="scss">
.logout-button {
	border: 1px solid $dark-grey;
	border-radius: 5px;
	padding: 2px 10px;
	&:hover {
		background-color: $light-grey;
	}
}
</style>
