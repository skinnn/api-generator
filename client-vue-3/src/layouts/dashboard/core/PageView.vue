<script>
import { defineAsyncComponent } from 'vue'
import { RouterView } from 'vue-router'

export default {
	name: 'DashboardPageView',
	components: {
    RouterView,
		FooterBar: () => defineAsyncComponent(() => import('./Footer.vue'))
	}
};
</script>

<template>
	<div class="page-view">
		<transition name="fade" mode="out-in">
			<RouterView />
		</transition>
    <FooterBar />
	</div>
</template>

<style scoped lang="scss">
	.page-view {
		position: relative;
		top: $top-bar-height;
		left: $sidebar-width;
		display: flex;
		flex-direction: column;
		width: calc(100% - $sidebar-width);
		padding: 0px;
		min-height: calc(90vh - #{$top-bar-height});
		transition: all 200ms;
		overflow-y: auto;
		.fade-enter-active,.fade-leave-active {
			transition: opacity 200ms;
		}
		.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
			opacity: 0;
		}
	}
	.page-view--full-size {
		width: 100%;
		left: 0;
	}
</style>
