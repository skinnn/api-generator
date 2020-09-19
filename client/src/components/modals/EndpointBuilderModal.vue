<template>
	<div ref="endpointBuilderModal" class="endpoint-builder-modal">
		<transition name="fade" mode="out-in">
			<BaseModal :show="show">
				<slot></slot>
			</BaseModal>
		</transition>
	</div>
</template>

<script>
import BaseModal from '@/components/base/BaseModal.vue';

export default {
	name: 'EndpointBuilderModal',
	components: { BaseModal },
	props: {
		show: {
			type: Boolean,
			default: false
		}
	},

	data() {
		return {
			showHelp: false
		};
	},

	mounted() {
		// Add close event listener
		const container = this.$refs.endpointBuilderModal.querySelector('.modal-container');
		container.addEventListener('click', (e) => {
			if (e.target.classList.contains('modal-container')) {
				this.$emit('closeModal');
			}
		});
		// Add title close to outside of the endpoint builder
		container.addEventListener('mousemove', (e) => {
			if (e.target.classList.contains('modal-container')) {
				container.setAttribute('title', 'Click to close the endpoint builder');
			} else {
				container.removeAttribute('title');
			}
		});
	}
};
</script>

<style scoped lang="scss">
</style>