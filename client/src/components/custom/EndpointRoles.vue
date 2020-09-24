<template>
	<div class="endpoint-roles">
		<button @click="displayRoles()">View</button>
		<div v-if="showTooltip">
			<!-- <div v-html="formattedRoles"></div> -->
		</div>
	</div>
</template>

<script>
export default {
	name: 'EndpointRoles',
	props: {
		endpoint: { type: Object, required: true }
	},

	data() {
		return {
			showTooltip: false
		};
	},

	methods: {
		displayRoles() {
			this.showTooltip = true;
		}
	},
};
</script>

<style scoped lang="scss">
.endpoint-roles {

	button {
		color: $main-blue;
		border: none;
		background-color: transparent;
		cursor: pointer;

		&:hover {
			text-decoration: underline;
		}

		&:focus,
		&:active {
			outline: none;
			box-shadow: none;
		}
	}
}
</style>