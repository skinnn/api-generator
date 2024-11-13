<script>
import { ref, watch } from 'vue';
import { useRoute } from 'vue-router';

export default {
	name: 'BackButton',
	setup() {
    const route = useRoute()
    const lastRoutePath = ref('')

    const handleGoBack = () => {
      console.log('handleGoBack')
			// if (this.$route.name !== this.lastRoutePath) {
			// 	this.lastRoutePath = this.$route.path;
			// 	this.$router.back();
			// 	this.$refs.button.classList.add('disabled');
			// } else {
			// 	// console.log('trying to go to the same route')
			// 	// console.log('lastRoutePath: ', this.lastRoutePath)
			// 	// console.log('this.$route: ', this.$route.name)
			// 	this.$refs.button.classList.add('disabled');
			// }
		}

    watch(route, () => {
      console.log('route change:', route)
      // this.$refs.button.classList.remove('disabled');
    })

		return {
			lastRoutePath,
      handleGoBack
		};
	}
};
</script>

<template>
	<button @click="handleGoBack()" ref="button" class="btn back-btn disabled">
		<slot v-if="$slots.default"></slot>
		<span v-else>Go back</span>
	</button>
</template>

<style lang="scss">
.back-btn {
	border: 1px solid $medium-grey;
	font-size: 0.8rem;
	margin-left: 10px;
	color: $medium-grey;

	&:active,
	&:focus {
		outline: none;
		box-shadow: none;
	}
}

</style>
