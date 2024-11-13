<template>
	<div class="dashboard-layout">
		<Topbar :payload="test" />
		<Sidebar />
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
		Sidebar: () => import('./core/Sidebar'),
		Topbar: () => import('./core/Topbar'),
		PageView: () => import('./core/PageView')
	}
};
</script>

<style lang="scss">
.dashboard-layout {
	width: 100vw;
	height: 100vh;
	overflow-y: hidden;
}
</style>
