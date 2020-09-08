<template>
	<div class="endpoints-page">
		<BaseModal :show="tfalseue">
			<EndpointBuilder />
		</BaseModal>
	</div>
</template>

<script>
// Components
import BaseModal from '@/components/base/BaseModal';
import EndpointBuilder from '@/components/custom/EndpointBuilder.vue';

export default {
	components: { EndpointBuilder, BaseModal }
};
</script>

<style scoped lang="scss">
</style>