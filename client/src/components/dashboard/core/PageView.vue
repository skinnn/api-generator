<template>
	<div class="pageView">
		<transition name="fade" mode="out-in">
			<router-view></router-view>
		</transition>
    <Footer />
	</div>
</template>

<script>
export default {
	name: 'DashboardPageView',
	components: {
		Footer: () => import('./Footer')
	}
};
</script>

<style lang="scss">
	.pageView {
		display: flex;
		position: relative;
		flex-direction: column;
		width: 100%;
		padding: 0px 0px;
		margin-left: $sidebar-width;
		top: $top-bar-height;
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
	.pageView--full-size{
		padding-left: 0px;
	}
	@media screen and (max-width: 768px) {
	.pageView {
		padding-left: 0px;
  }
}
</style>