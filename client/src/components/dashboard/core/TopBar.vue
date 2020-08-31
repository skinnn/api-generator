<template>
	<div id="navBar">
		<nav>
			<div class="menu">
				<div>
					<!-- <div class="menu__ico"><img  src="@/assets/img/icons/ico_app.svg"></div> -->
					<div class="menu__name">Easy Campaign</div>
					<!-- <div @click="handleSidebar" class="menu__button"><img src="@/assets/img/icons/ico_menu.svg"></div> -->
				</div>
				<div class="menu__separator"></div>
				<div class="menu__title">Create campaign</div>
			</div>
			<div class="menu-right">
				<!-- <div class="tools_button"><img src="@/assets/img/icons/ico_tools.svg"></div> -->
				<div class="user">
					<!-- <div class="user__photo"><img src="@/assets/img/placeholders/user_photo.png"></div> -->
					<div class="user__name">logged_in_user</div>
				</div>
				<!-- <div class="user_menu_button"><img src="@/assets/img/icons/ico_user_menu.svg"></div> -->
				<a @click="logout(event)" href="#">
					<!-- <img src="@/assets/img/icons/ico_logout.svg"> -->
				</a>
			</div>
		</nav>
	</div>
</template>

<script>
export default {
	name: 'DashboardTopBar',
	props: ['payload'],

	data() {
		return {
			sideBarOpen: false,
		};
	},

	methods: {
		handleSidebar() {
			this.sideBarOpen = !this.sideBarOpen;

			const sideBar = document.querySelector('.sidebar');
			const pageView = document.querySelector('.pageView');
			console.log('sidebar:', sideBar);
			console.log('pageView:', pageView);
			console.log('sideBar var:', this.sideBarOpen);

			if (this.sideBarOpen) {
				sideBar.classList.add('sidebar--hidden');
				pageView.classList.add('pageView--full-size');
			} else {
				sideBar.classList.remove('sidebar--hidden');
				pageView.classList.remove('pageView--full-size');
			}
		}
	}
};

</script>

<style lang="scss">
#navBar{
  //grid-area: navBar;
	position: fixed;
	z-index: 100;
	width: 100%;
	height: $top-bar-height;
}
  /*NAV////////////////////////////////////////////////////////////////*/
nav {
  display: flex;
	flex-direction: row;
	width: 100%;
  padding: 15px 35px;
  background-color: $sections-bg-color;
}
nav img {
  height: 20px;
}

.menu {
	display: flex;
	flex-direction: row;
	align-self: flex-start;
	flex-grow: 4;
	align-items:center;
	div {
		display: flex;
		flex-direction: row;
		margin-right: 10px;
		align-items:center;
	}
	.menu__ico {
		float: left;
		img {
			width: 40px;
			height: 40px;
		}
	}
	.menu__name {
		font-weight: 600;
	}
	.menu__button {
		cursor: pointer;
		img {
		width: 18px;
		}
	}
	.menu__separator {
		width: 2px;
		background-color: $light-grey;
		height: 22px;
	}
	.menu__title {
		color: $medium-grey;
	}
}

.menu-right {
	display: flex;
  align-self: flex-end;
	align-items: center;
	div {
		margin-right: 10px;
	}
	.user{
		display: flex;
		align-items: center;
		.user__photo img {
		width: 40px;
		height: 40px;
		border-radius: 50px;
		}
		.user__name {
		color: $medium-grey;
		font-size: 0.8em;
		}
	}
}

@media screen and (max-width: 768px) {
	nav {
  padding: 15px 5px;
	font-size: 0.8em;
	}
	.menu{
		.menu__name {
		display: none;
		font-weight: 200;
	}
	}
	.user__name {
		display: none;
		}
 }
/*NAV////////////// END//////////////////////////////////////////////////*/
</style>