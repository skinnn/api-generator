<template>
	<div class="endpoints-page">
		<button
			class="create-endpoint"
			@click="showEndpointBuilderModal = !showEndpointBuilderModal"
		>
			Create endpoint
		</button>

		<EndpointTable />

		<BaseTable :endpoints="endpoints" />

		<BaseModal :show="showEndpointBuilderModal" @closeModal="handleCloseModal">
			<EndpointBuilder @onSuccess="handleEndpointCreated()" />
		</BaseModal>
	</div>
</template>

<script>
// Components
import BaseModal from '../../components/base/BaseModal.vue';
import BaseTable from '../../components/base/BaseTable.vue';
import EndpointBuilder from '@/components/custom/EndpointBuilder.vue';
import EndpointTable from '@/components/custom/EndpointTable.vue';

export default {
	components: { BaseModal, BaseTable, EndpointBuilder, EndpointTable },

	data() {
		return {
			endpoints: [],
			showEndpointBuilderModal: false
		};
	},

	created() {
		this.getEndpoints();
	},

	methods: {
		async getEndpoints() {
			try {
				const res = await this.$http.endpoint.getEndpoints();
				const endpoints = res.data;
				// this.mutateEndpoints(endpoints);
				this.endpoints = endpoints;
			} catch (err) {
				console.error(err);
			}
		},

		handleCloseModal() {
			this.showEndpointBuilderModal = false;
		},

		handleEndpointCreated() {
			this.showEndpointBuilderModal = false;
		}
	}
};
</script>

<style lang="scss">
button.create-endpoint {
	border: none;
}

.endpoint-builder-modal {
	width: 70%;
	padding: 30px 40px;

	.endpoint-builder {
		width: 50%;
	}
}
</style>
