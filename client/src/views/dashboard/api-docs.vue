<template>
	<div class="api-docs-page">
		<p>API Documentation</p>
	</div>
</template>

<script>
// TODO: Generate docs for an endpoint
// TODO: Generate request and response examples
// TODO: Add request method, Content-Type
export default {
	/**
	 * Handle API Docs page access
	 */
	beforeRouteEnter(to, from, next) {
		next(async (vm) => {
			try {
				const res = await vm.$http.documentation.getVisbilityStatus();
				const { status } = res.data;
				if (status === 'public') {
					return next(true);

				// If status is 'private' check roles
				} else if (status === 'private') {
					const isAllowedToAccess = vm.$store.getters['user/isAdmin'];
					if (isAllowedToAccess) {
						return next({ name: 'login' });
					} else {
						return next({ name: 'login' });
					}
				}
			} catch (err) {
				console.error(err);
				return next({ name: 'login' });
			}
		});
	}
};
</script>

<style>

</style>