<template>
	<div class="endpoint-builder-property">
		<h5 class="prop-heading"><span>{{ property.name }}</span></h5>
		<div class="form-group">
			<label for="prop-name">Name <span class="required">*</span></label>
			<input type="text"
				v-model="property.name"
				@change="$emit('update:name', property.name);"
				class="form-control"
			>
			<small class="form-text text-muted">E.g: <strong>categories</strong></small>
		</div>
		<div class="form-group">
			<label for="prop-title">Title</label>
			<input type="text"
				v-model="property.title"
				@change="$emit('update:title', property.title);"
				class="form-control"
			>
		</div>
		<div class="form-group">
			<label for="prop-description">Description</label>
			<input type="text"
				v-model="property.description"
				@change="$emit('update:description', property.description);"
				class="form-control"
			>
			<small class="form-text text-muted">E.g: Array of post category IDs</small>
		</div>

		<div class="form-group">
			<label for="prop-type"><strong>Type</strong> <span class="required">*</span></label>
			<select
				v-model="property.type"
				@change="$emit('update:type', property.type);"
				class="custom-select"
			>
				<option value="string">string</option>
				<option value="boolean">boolean</option>
				<option value="integer">integer</option>
				<option value="number">number</option>
				<option value="object">object</option>
				<option value="array">array</option>
			</select>
		</div>

		<div class="form-group">
			<label for="prop-format"><strong>Format</strong><span class="optional"> (optional)</span></label>
			<select
				v-model="property.format"
				@change="$emit('update:format', property.format);"
				class="custom-select"
			>
				<option selected value="">(none)</option>
				<option value="date">date</option>
				<option value="time">time</option>
				<option value="date-time">date-time</option>
				<option value="uri">uri</option>
				<option value="uri-reference">uri-reference</option>
				<option value="uri-template">uri-template</option>
				<option value="url">url</option>
				<option value="email">email</option>
				<option value="hostname">hostname</option>
				<option value="ipv4">ipv4</option>
				<option value="ipv6">ipv6</option>
				<option value="regex">regex</option>
				<option value="uuid">uuid</option>
				<option value="json-pointer">json-pointer</option>
				<option value="relative-json-pointer">relative-json-pointer</option>
				<option value="buffer">buffer</option>
			</select>
		</div>

		<p style="color:red;">Relations are not yet implemented</p>
		<div class="form-group relation-group">
			<fieldset>
				<h6>Relation <span class="optional"> (optional)</span></h6>
				<small class="form-text text-muted">Relations to other endpoints like one-to-many, many-to-many</small>

				<div class="form-group">
					<label for="prop-relation-endpoint">Link to endpoint</label>
					<input type="text"
					v-model="property.relation.endpoint"
					@change="$emit('update:relationEndpoint', property.relation.endpoint);"
						class="form-control"
						placeholder="Endpoint name"
					>
				</div>

				<div class="form-group">
					<p>Link to many</p>
					<div class="form-check">
						<input type="checkbox"
							v-model="property.relation.many"
							@change="$emit('update:relationMany', property.relation.many);"
							class="form-check-input"
						>
						<label class="form-check-label" for="prop-relation-many">Many</label>
					</div>
				</div>

				<div class="form-group">
					<label for="prop-relation-endpoint">Inverse</label>
					<input type="text"
						v-model="property.relation.inverse"
						@change="$emit('update:name', property.relation.inverse);"
						class="form-control"
						placeholder="Inverse field in the linked endpoint (optional)"
					>
				</div>
			</fieldset>
		</div>

		<div class="form-group">
			<p>Is this property required?</p>
			<div class="form-check">
				<input id="prop-required" type="checkbox" class="form-check-input">
				<label for="prop-required" class="form-check-label">Required</label>
			</div>
		</div>
	</div>
</template>

<script>
// TODO: Reorder inputs for desktop to shorten the builder height and make it more accessible

export default {
	name: 'EndpointBuilderProperty',
	props: {
		property: {
			type: Object,
			default: () => ({
				id: '',
				name: '',
				title: '',
				description: '',
				type: '',
				format: '',
				relation: {
					endpoint: '',
					many: false,
					inversed: ''
				},
				required: false
			})
		}
	},

	data() {
		return {
			currentlyEditing: false
		};
	},

	watch: {
		property: {
			deep: true,
			handler(prop) {
				console.log('EDITING', prop.name);
				this.$emit('editing', prop);
			}
		}
	}
};
</script>

<style lang="scss">
.endpoint-builder-property {

	.prop-heading {
		display: inline-block;
		padding: 5px 10px;
		border-radius: 5px;
		transition: background-color 500ms ease-in-out,
								color 500ms ease-in-out;

		&.duplicate-error {
			color: #fff;
			background-color: red !important;
		}
		&.scrolled-to-error {
			background-color: pink;
		}
	}

	.relation-group {
		background-color: rgba(51, 51, 51, 0.2);
		padding: 15px;
		opacity: 0.25;
	}
}
</style>