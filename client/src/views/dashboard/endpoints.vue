<template>
	<div class="endpoints-page">
		<button @click="showEndpointBuilderModal = !showEndpointBuilderModal">
			Endpoint builder
		</button>

		<EndpointTable />

		<EndpointBuilderModal :show="showEndpointBuilderModal" @closeModal="handleCloseModal">
			<EndpointBuilder />
		</EndpointBuilderModal>
	</div>
</template>

<script>
// Components
import EndpointBuilderModal from '@/components/modals/EndpointBuilderModal';
import EndpointBuilder from '@/components/custom/EndpointBuilder.vue';
import EndpointTable from '@/components/custom/EndpointTable.vue';

export default {
	components: { EndpointBuilder, EndpointBuilderModal, EndpointTable },

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