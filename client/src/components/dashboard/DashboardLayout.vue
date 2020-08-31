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

//   #main_container {
// 	display: grid;
// 	height: 100%;
//   grid-template-columns: 14% 86%;
//   grid-template-rows: auto;
//   grid-template-areas:
//     "navBar navBar"
//     "sidebar dashboards"
//     "sidebar footer";
// }

// @media screen and (max-width: 976px) {
//   #main_container {
//     grid-template-areas:
//       "navBar navBar"
//       "sidebar sidebar "
//       "dashboards dashboards"
//       "footer footer";
//   }
// }

  #main_container {
	display: flex;
	flex-direction: row;
	height: calc(100vh -0px);
}

@media screen and (max-width: 976px) {
  #main_container {
}
}

</style>