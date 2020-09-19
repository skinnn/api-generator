<template>
<div id="endpoint-builder" class="endpoint-builder">
	<h3>Endpoint builder</h3>
	<form @submit="handleSubmit" class="endpoint-form">
		<div class="form-group">
			<label for="name">
				Name
				<BaseHelper>
					<small class="text-muted">Name of your endpoint, used in URL-s, e.g. <strong>posts</strong></small>
				</BaseHelper>
			</label>
			<input type="text" class="form-control" v-model="endpoint.name">
			<!-- <small class="form-text text-muted">Name of your endpoint, used in URL-s, e.g. <strong>posts</strong></small> -->
		</div>
		<div class="form-group">
			<label for="title">
				Title
				<BaseHelper>
					<small class="text-muted">Descriptive title for the endpoint, e.g. <strong>Post endpoint</strong> <strong>Post endpoint</strong> <strong>Post endpoint</strong> <strong>Post endpoint</strong> <strong>Post endpoint</strong></small>
				</BaseHelper>
			</label>
			<input type="text" class="form-control" v-model="endpoint.title">
			<!-- <small class="form-text text-muted">Descriptive title for the endpoint, e.g. <strong>Post endpoint</strong></small> -->
		</div>
		<div class="form-group">
			<label for="description">Description</label>
			<textarea type="text" class="form-control" id="endpoint-description"></textarea>
		</div>
		<div class="form-group access-group">
			<fieldset>
				<h4>
					Access <span class="required">*</span>
					<BaseHelper>
						<small class="text-muted">Define access to CRUD for user roles and record owner. Role <strong>root</strong> has access to all operations by default.</small>
					</BaseHelper>
				</h4>

				<div class="form-group">
					<label for="endpoint-access-create"><strong>Create:</strong></label>
					<select v-model="endpoint.access.create.roles" class="custom-select" multiple>
						<option v-for="option in options.createRoles" :value="option.value" :key="option.value">{{ option.text }}</option>
					</select>
				</div>

				<div class="form-group">
					<label for="endpoint-access-read"><strong>Read:</strong></label>
					<select v-model="endpoint.access.read.roles" class="custom-select" multiple>
						<!-- Loaded roles -->
						<option v-for="option in options.readRoles" :value="option.value" :key="option.value">{{ option.text }}</option>
					</select>
					<div class="form-check">
						<input type="checkbox" checked class="form-check-input" v-model="endpoint.access.read.owner">
						<label class="form-check-label" for="endpoint-access-read-owner">Owner only</label>
					</div>
				</div>

				<div class="form-group">
					<label for="endpoint-access-update"><strong>Update:</strong></label>
					<select id="endpoint-access-update" class="custom-select" multiple>
						<option v-for="option in options.updateRoles" :value="option.value" :key="option.value">{{ option.text }}</option>
					</select>
					<div class="form-check">
						<input type="checkbox" checked class="form-check-input" v-model="endpoint.access.update.owner">
						<label class="form-check-label" for="endpoint-access-read-owner">Owner only</label>
					</div>
				</div>

				<div class="form-group">
					<label for="endpoint-access-delete"><strong>Delete:</strong></label>
					<select v-model="endpoint.access.delete.roles" class="custom-select" multiple>
						<option v-for="option in options.deleteRoles" :value="option.value" :key="option.value">{{ option.text }}</option>
					</select>
					<div class="form-check">
						<input type="checkbox" checked class="form-check-input" v-model="endpoint.access.delete.owner">
						<label class="form-check-label" for="endpoint-access-read-owner">Owner only</label>
					</div>
				</div>
			</fieldset>
		</div>
		<div class="form-group">
			<h4>Properties:</h4>
			<hr>
			<ul id="properties">
				<li
					v-for="(prop, index) in endpoint.properties"
					:key="index"
					:class="['endpoint-property', 'single-property']"
					:data-id="prop.id"
				>
					<EndpointBuilderProperty :property="prop" @editing="handleCurrentlyEditingProp" />
				</li>
			</ul>
			<button @click="addNewPropField()" type="button" class="btn btn-primary">Add property</button>
		</div>

		<!-- TODO: ? Create separate component for Endpoint Builder error messages -->
		<!-- TODO: Make messages more accessible, change layout so they are always visible to the user on desktop/tablet  -->
		<div class="form-group">
		<!-- Error messages -->
			<div class="error-messages">
				<p v-for="(err, index) in errors" :key="index" class="error-message">
					{{ err.message }}
					<button v-if="err.name === 'DuplicatPropertyeNameError'" @click="scrollToProperty(err)" class="scroll-to-property">
						Take me there
					</button>
				</p>
			</div>
			<div class="success-messages">

			</div>
		</div>

		<div class="form-group">
			<button type="submit" class="btn btn-success create-endpoint-btn">
				<!-- TODO: Add feather and/or fortawesome icons -->
				<!-- <svg class="feather"><use xlink:href="icons/feather/feather-sprite.svg#aperture"/></svg> -->
				Create endpoint
			</button>
		</div>
	</form>
</div>
</template>

<script>
import { v4 as uuidv4 } from 'uuid';
// Components
import EndpointBuilderProperty from './EndpointBuilderProperty.vue';
import BaseHelper from '@/components/base/BaseHelper.vue';

export default {
	name: 'EndpointBuilder',
	components: { EndpointBuilderProperty, BaseHelper },

	// computed: {
	// 	endpointProperties() {
	// 		return this.endpoint.properties;
	// 	}
	// },

	data() {
		return {
			currentlyEditingProperty: '',
			endpoint: {
				name: '',
				title: '',
				description: '',
				access: {
					create: { roles: [] },
					read: { roles: [], owner: true },
					update: { roles: [], owner: true },
					delete: { roles: [], owner: true }
				},
				properties: []
			},
			options: {
				select: {
					createRoles: [],
					readRoles: [],
					updateRoles: [],
					deleteRoles: [],
				}
			},
			errors: []
		};
	},

	mounted() {
		this.getRoles();
	},

	methods: {
		handleSubmit(e) {
			e.preventDefault();
			console.log('endpoint on submit:', this.endpoint);
		},

		addNewPropField() {
			// TODO: Add suport for adding custom number of props at once (Add property x 10)
			const newProperty = {
				id: uuidv4(),
				name: 'categories',
				title: 'Post categories',
				description: 'Array of post category IDs',
				type: 'array',
				format: '',
				relation: {
					endpoint: 'post',
					many: true,
					inversed: '__inverse_test'
				},
				required: true
			};
			this.endpoint.properties.push(newProperty);
		},

		handleCurrentlyEditingProp(currentlyEditingProp) {
			const otherProperties = this.endpoint.properties.filter((prop) => prop.id !== currentlyEditingProp.id);

			// Check for duplicate property names
			otherProperties.forEach((prop) => {
				if (prop.name !== '' && prop.name === currentlyEditingProp.name) {
					const el = document.querySelector(`li[data-id="${currentlyEditingProp.id}"]`);
					const heading = el.querySelector('.prop-heading');
					// const errAlreadyExist = this.errors.some((err) => err.property.name === prop.name);

					// if (!errAlreadyExist) {
					// Show an error, add some styles
					this.errors.push({ name: 'DuplicatPropertyeNameError', message: `Property with this name already exist: ${prop.name}`, property: currentlyEditingProp });
					heading.classList.add('duplicate-error');
					// }
				} else {
					this.errors.forEach((err, index) => {
						if (err.name === 'DuplicatPropertyeNameError' && err.property.id === currentlyEditingProp.id) {
							const el = document.querySelector(`li[data-id="${currentlyEditingProp.id}"]`);
							const heading = el.querySelector('.prop-heading');
							heading.classList.remove('duplicate-error');
							this.errors.splice(index, 1);
						}
					});
				}
			});
		},

		scrollToProperty(error) {
			console.log('scroll too..', error);
			// Scroll to duplicate, apply some styles to the DOM
			const el = document.querySelector(`li[data-id="${error.property.id}"]`);
			const heading = el.querySelector('.prop-heading');
			console.log('heading:', heading);
			heading.classList.add('scrolled-to-error');
			setTimeout(() => {
				heading.classList.remove('scrolled-to-error');
			}, 2500);
			heading.scrollIntoView({ block: 'center' });
		},

		getRoles() {
			// TODO: Get roles from the API
			const options = [{ text: 'admin', value: 'admin' }, { text: 'user', value: 'user' }, { text: 'anon', value: 'anon' }];
			this.options.createRoles = options;
			this.options.readRoles = options;
			this.options.updateRoles = options;
			this.options.deleteRoles = options;
		}
	},

	// watch: {
	// 	endpointProperties: {
	// 		deep: true,
	// 		handler(properties) {}
	// 	}
	// }
};
</script>

<style scoped lang="scss">
// TODO: Refactor CSS to SCSS

.endpoint-builder {
	scroll-behavior: smooth;
}

form.endpoint-form input,
form.endpoint-form select {
	font-size: 14px;
}

form.endpoint-form .required {
	color: red;
}
form.endpoint-form .optional {
	font-size: 12px;
	color: rgba(0, 0, 0, 0.4);
}

form.endpoint-form .create-endpoint-btn .feather {
	position: relative;
	bottom: 2px;
	margin-right: 5px;
}

.form-group label {
	display: block;
}

.error-message {
	.scroll-to-property {
		padding: 5px 5px;
		border: none;
		border-radius: 5px;
		background-color: transparent;
		font-weight: 600;
		font-size: 15px;
		&:hover {
			text-decoration: underline;
		}
	}
}

.error-messages .error-message {
	color: #fff;
	background-color:#ee4545;
	padding: 10px 15px;
	border-radius: 5px;
}

.success-messages .success-message {
	color: #fff;
	background-color: #35d535;
	padding: 10px 15px;
	border-radius: 5px;
}
.success-messages .success-message .highlighted {
	font-weight: 600;
}
</style>