<template>
	<div class="endpoints-page">
		<button @click="showEndpointBuilderModal = !showEndpointBuilderModal">
			Endpoint builder
		</button>
		<EndpointBuilderModal :show="showEndpointBuilderModal" @closeModal="handleCloseModal">
			<EndpointBuilder />
		</EndpointBuilderModal>
	</div>
</template>

<script>
// Components
import EndpointBuilderModal from '@/components/modals/EndpointBuilderModal';
import EndpointBuilder from '@/components/custom/EndpointBuilder.vue';

export default {
	components: { EndpointBuilder, EndpointBuilderModal },

	data() {
		return {
			showEndpointBuilderModal: false
		};
	},

	methods: {
		handleCloseModal() {
			this.showEndpointBuilderModal = false;
		}
	}
};
</script>

<style scoped lang="scss">
</style>