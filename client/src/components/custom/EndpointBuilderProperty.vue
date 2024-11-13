<template>
	<div class="endpoint-builder-property">
		<header>
			<span class="prop-index">{{ index + 1 }}</span>
			<h5 :class="['prop-heading', {'duplicate-error': property.error && property.error.name === 'DuplicatePropertyName'}]">
				<span>{{ property.name }}</span>
			</h5>
			<button type="button" @click="$emit('delete', property)" class="remove-btn">
				Remove
			</button>
		</header>
		<main>
			<div class="form-group">
				<label for="prop-name">Name <span class="required">*</span></label>
				<input type="text"
					v-model="property.name"
					@input="$emit('update:name', property);"
					class="form-control"
				>
				<small class="form-text text-muted">E.g: <strong>categories</strong></small>
			</div>
			<div class="form-group">
				<label for="prop-title">Title</label>
				<input type="text"
					v-model="property.title"
					@input="$emit('update:title', property);"
					class="form-control"
				>
			</div>
			<div class="form-group">
				<label for="prop-description">Description</label>
				<input type="text"
					v-model="property.description"
					@input="$emit('update:description', property);"
					class="form-control"
				>
				<small class="form-text text-muted">E.g: Array of post category IDs</small>
			</div>

			<div class="form-group">
				<label for="prop-type"><strong>Type</strong> <span class="required">*</span></label>
				<select
					v-model="property.type"
					@input="$emit('update:type', property)"
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
					@input="$emit('update:format', property)"
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

			<!-- <p style="color: red;">Relations are not yet implemented</p>
			<div class="form-group relation-group">
				<fieldset>
					<h6>Relation <span class="optional"> (optional)</span></h6>
					<small class="form-text text-muted">Relations to other endpoints like one-to-many, many-to-many</small>

					<div class="form-group">
						<label for="prop-relation-endpoint">Link to endpoint</label>
						<input type="text"
							v-model="property.relation.endpoint"
							@change="$emit('update:relationEndpoint', property.relation.endpoint)"
							class="form-control"
							placeholder="Endpoint name"
						>
					</div>

					<div class="form-group">
						<p>Link to many</p>
						<div class="form-check">
							<input type="checkbox"
								v-model="property.relation.many"
								@change="$emit('update:relationMany', property.relation.many)"
								class="form-check-input"
							>
							<label class="form-check-label" for="prop-relation-many">Many</label>
						</div>
					</div>

					<div class="form-group">
						<label for="prop-relation-endpoint">Inverse</label>
						<input type="text"
							v-model="property.relation.inverse"
							@change="$emit('update:name', property.relation.inverse)"
							class="form-control"
							placeholder="Inverse field in the linked endpoint (optional)"
						>
					</div>
				</fieldset>
			</div> -->

			<div class="form-group">
				<p>Is this property required?</p>
				<div class="form-check">
					<input id="prop-required" type="checkbox" class="form-check-input">
					<label for="prop-required" class="form-check-label">Required</label>
				</div>
			</div>
		</main>
	</div>
</template>

<script>
// TODO: Reorder inputs for desktop to shorten the builder height and make it more accessible

export default {
	name: 'EndpointBuilderProperty',
	props: {
		index: { type: [Number, String], default: '' },
		property: {
			type: Object,
			default: () => ({
				error: null,
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

	// computed: {
	// 	propertyName() {
	// 		return this.property.name;
	// 	}
	// },

	data() {
		return {
			// currentlyEditing: false,
			// error: null
		};
	},

	watch: {
		// property: {
		// 	deep: true,
		// 	handler(prop) {
		// 		console.log('EDITING', prop.name);
		// 		this.$emit('editing', prop);
		// 	}
		// },
		// errors: {
		// 	deep: true,
		// 	handler(errors) {
		// 		errors.forEach((err) => err.property.id === this.property.id)
		// 	}
		// }
	}
};
</script>

<style lang="scss">
.endpoint-builder-property {

	header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		width: 100%;
		padding: 10px 30px;
		background-color: #333;
		border-top-left-radius: 8px;
		border-top-right-radius: 8px;

		.prop-index {
			display: flex;
			align-items: center;
			justify-content: center;
			width: 30px;
			height: 30px;
			display: flex;
			justify-self: flex-start;
			margin-right: 15px;
			font-size: 20px;
			color: rgb(50, 236, 227);
			border: 2px solid rgb(50, 236, 227);
			border-radius: 50%;
		}

		.prop-heading {
			display: flex;
			justify-self: center;
			padding: 5px 10px;
			margin: 0;
			margin-left: -12px;
			color: #fff;
			border-radius: 5px;
			font-size: 22px;
			text-align: center;
			transition: background-color 500ms ease-in-out,
									color 500ms ease-in-out;

			&.duplicate-error {
				color: #fff;
				background-color: $error;
			}
			&.scrolled-to-error {
				color: rgb(255, 0, 0);
				background-color: #fff !important;
			}
		}

		.remove-btn {
			display: flex;
			justify-content: center;
			align-items: center;
			justify-self: flex-end;
			padding: 2px 10px;
			font-size: 14px;
			color: #fff;
			background-color: $error;
			border: 2px solid $error;
			border-radius: 5px;
			transition: all 200ms ease-in-out;
			&:hover {
				color: $error;
				background-color: #fff;
			}
		}
	}

	main {
		padding: 10px 30px;
	}

	.relation-group {
		background-color: rgba(51, 51, 51, 0.2);
		padding: 15px;
		opacity: 0.25;
		cursor: not-allowed;
	}
}
</style>
