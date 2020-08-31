<template>
	<div class="sidebar-cont">
		<div class="sidebar">
					<!-- Dashboard -->
			<router-link :to="{ name: 'admin-home' }">
				<div class="sidebar__button">
				<!-- <div class="sidebar__ico"><img src="@/assets/img/icons/ico_sidebar_02.svg"></div> -->
				<div class="sidebar__title">Dashboard</div>
			</div>
			</router-link>
			<router-link :to="{ name: 'admin-create-campaign' }">
				<div class="sidebar__button">
				<!-- <div class="sidebar__ico"><img src="@/assets/img/icons/ico_sidebar_02.svg"></div> -->
				<div class="sidebar__title">Create campaign</div>
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

<style lang="scss">

/*SIDEBAR////////////////////////////////////////////////////////////////*/
.sidebar-cont{
	display: flex;
	z-index: 11;
}
.sidebar {
  position: fixed;
	top:75px;
  background-color: $sections-bg-color;
  min-height: 100%;
  width: 300px;
  font-size: 0.8em;
  padding-top: 25px;
	transition: all 0.2s;
	overflow: hidden;
	left: 0px;
}

.sidebar--hidden{
  left: -300px;
}

.sidebar__button {
  width: 100%;
  padding: 15px 10px;
  cursor: pointer;
  border-right: 4px solid $sections-bg-color;
}
.sidebar__ico,
.sidebar__title {
  display: inline-block;
  vertical-align: middle;
  margin: 5px;
}
a{
	color: $dark-grey;
}
.router-link-exact-active  {
	color: $active-blue;
	font-weight: 600;
	.sidebar__button{
		background-color: $light-blue;
		border-right: 4px solid $active-blue!important;
		transition: all 0.2s;
	}
	.sidebar__ico {
		background-color: $active-blue;
}

}

@media screen and (max-width: 768px) {
  .sidebar{
		box-shadow: 0px 5px 10px rgb(145, 145, 145);
	}
}
/*SIDEBAR////////////////////////////////////////////////////////////////*/
</style>