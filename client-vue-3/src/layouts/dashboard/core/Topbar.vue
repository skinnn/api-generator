<script>
import config from '@/config/master.js'
import menuIcon from '@/assets/feather/menu.svg'
// Helpers
// import { mapGetters } from 'vuex';
// Components
import LogoutButton from '@/components/buttons/LogoutButton.vue';
import BackButton from '@/components/buttons/BackButton.vue';
import { reactive, ref } from 'vue';
import { RouterLink } from 'vue-router';

export default {
	name: 'DashboardTopbar',
  components: { RouterLink, LogoutButton, BackButton },
  props: {
    payload: String
  },
	// computed: {
	// 	...mapGetters('user', {
	// 		decodedToken: 'getDecodedToken'
	// 	})
	// },

	setup() {
    // TODO: Import from store
    const decodedToken = ref('decodedToken')
    const state = reactive({
      sideBarOpen: false,
      user: {
        username: ''
      }
    })

    const handleSidebar = () => {
			state.sideBarOpen = !state.sideBarOpen;

			const sideBar = document.querySelector('.sidebar');
			const pageView = document.querySelector('.page-view');

			if (state.sideBarOpen) {
				sideBar.classList.add('sidebar--hidden');
				pageView.classList.add('page-view--full-size');
			} else {
				sideBar.classList.remove('sidebar--hidden');
				pageView.classList.remove('page-view--full-size');
			}
		}

    if (decodedToken.value) {
			const { username } = decodedToken;
			state.user.username = username;
		}

		return {
      config,
      menuIcon,
			state,
      handleSidebar
		};
	}
};
</script>

<template>
	<div class="topbar">
		<nav>
			<div class="menu">
				<div class="left-side">
					<!-- <div class="menu__ico"><img  src="@/assets/img/icons/ico_app.svg"></div> -->
					<RouterLink :to="{ name: 'home' }" class="menu-name">{{ config.appName }}</RouterLink>
					<div @click="handleSidebar()" class="menu__button">
						<img :src="menuIcon">
					</div>
				</div>
				<div class="menu-separator"></div>
				<div class="menu-title">Home</div>
				<!-- <BackButton /> -->
			</div>
			<ul class="menu-right">
				<!-- <div class="tools_button"><img src="@/assets/img/icons/ico_tools.svg"></div> -->
				<li class="link username">{{ state.user.username }}</li>
				<li class="link api-docs">
					<RouterLink :to="{ name: 'api-docs' }">Docs</RouterLink>
				</li>
				<!-- <div class="user_menu_button"><img src="@/assets/img/icons/ico_user_menu.svg"></div> -->
				<!-- <LogoutButton /> -->
			</ul>
		</nav>
	</div>
</template>

<style scoped lang="scss">
.topbar{
	position: fixed;
	z-index: 100;
	width: 100%;
	height: $top-bar-height;
}
nav {
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	width: 100%;
	height: 100%;
	padding: 15px 35px;
	background-color: $sections-bg-color;
	border-bottom: 1px solid $light-grey;
}
nav img {
	height: 20px;
}

.menu {
	display: flex;
	flex-direction: row;
	align-self: center;
	align-items:center;
	.left-side {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items:center;
		width: calc(#{$sidebar-width} - 35px);
		padding-right: 20px;
	}
	.menu__ico {
		float: left;
		img {
			width: 40px;
			height: 40px;
		}
	}
	.menu-separator {
		width: 1px;
		background-color: $light-grey;
		height: 22px;
		margin-right: 20px;
	}
	.menu-name {
		font-weight: 600;
		text-decoration: none;
		color: $dark-grey;
	}
	.menu__button {
		cursor: pointer;
		img {
			width: 18px;
		}
	}
	.menu-title {
		color: $medium-grey;
	}
}

ul.menu-right {
	display: flex;
	align-self: center;
	align-items: center;
	list-style: none;
	margin: 0;
	li {
		margin-right: 10px;

		&.link {
			color: $medium-grey;
			font-size: 0.8em;
		}

		&.username {
			display: flex;
			align-items: center;
		}
	}
}

@media screen and (max-width: 768px) {
	nav {
		padding: 15px 5px;
		font-size: 0.8em;
	}
	.menu{
		.menu-name {
			display: none;
			font-weight: 200;
		}
	}
	.user-name {
		display: none;
	}
 }
</style>
