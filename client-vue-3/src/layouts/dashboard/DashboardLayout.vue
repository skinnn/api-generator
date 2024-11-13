<script>
import Topbar from './core/Topbar.vue';
import { defineAsyncComponent, ref } from 'vue'

export default {
	name: 'AdminDashboard',
	setup() {
    const test = ref('test prop')
		return {
			test
		}
	},
	components: {
    Topbar,
		// Topbar: () => defineAsyncComponent(() => import('./core/Topbar.vue')),
		// Sidebar: () => defineAsyncComponent(() => import('./core/Sidebar.vue')),
		// PageView: () => defineAsyncComponent(() => import('./core/PageView.vue'))
	}
};
</script>

<template>
	<div class="dashboard-layout">
		<Topbar :payload="test" />
		<!-- <Sidebar /> -->
		<!-- <PageView /> -->
	</div>
</template>

<style lang="scss">
.dashboard-layout {
	width: 100vw;
	height: 100vh;
	overflow-y: hidden;
}
</style>
