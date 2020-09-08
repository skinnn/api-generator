<template>
	<div id="main_container">
		<TopBar :payload="test" />
		<CoreSidebar />
		<PageView />
	</div>
</template>

<script>
export default {
	name: 'AdminDashboard',

	data() {
		return {
			test: 'test...'
		};
	},

	components: {
		CoreSidebar: () => import('./core/Sidebar'),
		TopBar: () => import('./core/TopBar'),
		PageView: () => import('./core/PageView'),
	}
};
</script>

<style lang="scss">
#main_container {
	display: flex;
	flex-direction: row;
	height: 100vh;
}
</style>