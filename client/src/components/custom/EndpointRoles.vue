<template>
	<div class="endpoint-roles">
		<button @click="displayRoles()">Expand</button>
		<div v-if="showTooltip">
				<!-- <div v-html="formattedRoles"></div> -->
				Create: <strong>{{ endpoint._schema.access.create.roles.join(', ') }}</strong><br>
				Read<span style="padding-left: 17px"></span>: <strong>{{ endpoint._schema.access.read.roles.join(', ') }}</strong><br>
				Update: <strong>{{ endpoint._schema.access.update.roles.join(', ') }}</strong><br>
				Delete: <strong>{{ endpoint._schema.access.delete.roles.join(', ') }}</strong>
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
			this.showTooltip = !this.showTooltip;
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