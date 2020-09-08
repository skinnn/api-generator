<template>
	<div class="sidebar-container">
		<div class="sidebar">
			<router-link :to="{ name: 'home' }">
				<div class="sidebar-button">
				<!-- <div class="sidebar-icon"><img src="@/assets/img/icons/ico_sidebar_02.svg"></div> -->
				<div class="sidebar-title">Dashboard</div>
			</div>
			</router-link>
			<router-link :to="{ name: 'endpoints' }">
				<div class="sidebar-button">
				<!-- <div class="sidebar-icon"><img src="@/assets/img/icons/ico_sidebar_02.svg"></div> -->
				<div class="sidebar-title">Endpoints</div>
			</div>
			</router-link>
			<router-link :to="{ name: 'api-docs' }">
				<div class="sidebar-button">
				<!-- <div class="sidebar-icon"><img src="@/assets/img/icons/ico_sidebar_02.svg"></div> -->
				<div class="sidebar-title">API Documentation</div>
			</div>
			</router-link>
		</div>
	</div>
</template>

<script>

export default {
	name: 'DashboardSidebar',

	data() {
		return {};
	}
};
</script>

<style scoped lang="scss">
.sidebar-container{
	display: flex;
	z-index: 11;
}
.sidebar {
  position: fixed;
	top: $top-bar-height;
  background-color: $sections-bg-color;
  min-height: 100%;
	width: $sidebar-width;
  font-size: 0.8em;
  padding-top: 25px;
	transition: all 0.2s;
	overflow: hidden;
	left: 0px;
}

.sidebar--hidden {
  left: -300px;
}

.sidebar-button {
  width: 100%;
  padding: 15px 10px;
  cursor: pointer;
  border-right: 4px solid $sections-bg-color;
}
.sidebar-icon,
.sidebar-title {
  display: inline-block;
  vertical-align: middle;
  margin: 5px;
}
a {
	color: $dark-grey;
}
.router-link-exact-active {
	color: #fff;
	font-weight: 600;
	.sidebar-button {
		background-color: $light-blue;
		border-right: 4px solid $active-blue !important;
		transition: all 0.2s;
	}
	.sidebar-icon {
		background-color: $active-blue;
	}
}

@media screen and (max-width: 768px) {
  .sidebar{
		box-shadow: 0px 5px 10px rgb(145, 145, 145);
	}
}
</style>