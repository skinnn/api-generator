<template>
<div id="endpoint-builder" class="endpoint-builder">
	<h3>Endpoint builder</h3>
	<form @submit="handleSubmit" class="endpoint-form">
		<div class="form-group">
			<label for="name">
				Name
				<BaseHelper>
					Name of your endpoint, used in URL-s, e.g. <strong>posts</strong>
				</BaseHelper>
			</label>
			<input type="text" class="form-control" v-model="endpoint.name">
			<!-- <small class="form-text text-muted">Name of your endpoint, used in URL-s, e.g. <strong>posts</strong></small> -->
		</div>
		<div class="form-group">
			<label for="title">
				Title
				<BaseHelper>
					Descriptive title for the endpoint, e.g. <strong>Post endpoint</strong>
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
						Define access to CRUD for user roles and record owner. Role <strong>root</strong> has access to all operations by default.
					</BaseHelper>
				</h4>

				<div class="form-group">
					<label for="endpoint-access-create"><strong>Create:</strong></label>
					<select v-model="endpoint.access.create.roles" class="custom-select" multiple>
						<option v-for="option in options.select.createRoles" :value="option.value" :key="option.value">{{ option.text }}</option>
					</select>
				</div>

				<div class="form-group">
					<label for="endpoint-access-read"><strong>Read:</strong></label>
					<select v-model="endpoint.access.read.roles" class="custom-select" multiple>
						<!-- Loaded roles -->
						<option v-for="option in options.select.readRoles" :value="option.value" :key="option.value">{{ option.text }}</option>
					</select>
					<div class="form-check">
						<input type="checkbox" checked class="form-check-input" v-model="endpoint.access.read.owner">
						<label class="form-check-label" for="endpoint-access-read-owner">Owner only</label>
					</div>
				</div>

				<div class="form-group">
					<label for="endpoint-access-update"><strong>Update:</strong></label>
					<select id="endpoint-access-update" class="custom-select" multiple>
						<option v-for="option in options.select.updateRoles" :value="option.value" :key="option.value">{{ option.text }}</option>
					</select>
					<div class="form-check">
						<input type="checkbox" checked class="form-check-input" v-model="endpoint.access.update.owner">
						<label class="form-check-label" for="endpoint-access-read-owner">Owner only</label>
					</div>
				</div>

				<div class="form-group">
					<label for="endpoint-access-delete"><strong>Delete:</strong></label>
					<select v-model="endpoint.access.delete.roles" class="custom-select" multiple>
						<option v-for="option in options.select.deleteRoles" :value="option.value" :key="option.value">{{ option.text }}</option>
					</select>
					<div class="form-check">
						<input type="checkbox" checked class="form-check-input" v-model="endpoint.access.delete.owner">
						<label class="form-check-label" for="endpoint-access-read-owner">Owner only</label>
					</div>
				</div>
			</fieldset>
		</div>
		<fieldset class="endpoint-properties">
			<h4>Properties</h4>
			<ul class="endpoint-property-list">
				<li
					v-for="(prop, index) in endpoint.properties"
					:key="index"
					:class="['endpoint-property', 'single-property']"
					:data-id="prop.id"
				>
					<EndpointBuilderProperty
						:property="prop"
						:index="index"
						@delete="handleDeleteProperty"
						@update:name="handlePropNameChange"
					/>
				</li>
			</ul>
			<button @click="addNewPropField()" type="button" class="btn btn-primary">Add property</button>
		</fieldset>

		<!-- TODO: ? Create separate component for Endpoint Builder error messages -->
		<!-- TODO: Make messages more accessible, change layout so they are always visible to the user on desktop/tablet  -->
		<!-- TODO: Maek "Add Property" and "Create Endpoint" buttons more accessible, change layout so they are always visible -->
		<div class="form-group">
		<!-- Error messages -->
			<div class="error-messages">
				<div v-for="(err, index) in errors" :key="index" class="error-message">
					<div class="message-left">
						{{ err.message }}
					</div>
					<div class="options-rght">
						<button v-if="err.name === 'DuplicatePropertyName'" type="button" @click="scrollToProperty(err)" class="scroll-to-property">
							Go there
						</button>
						<button v-if="err.name === 'DuplicatePropertyName'" type="button" class="error-details">
							<BaseHelper text="Details" position="bottom">
								<span>Error: <b>{{ err.name }}</b></span><br>
								<span>Property: <b>{{ err.property.name }}</b></span>
							</BaseHelper>
						</button>
					</div>
				</div>
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
			// currentlyEditingProperty: null,
			endpoint: {
				name: 'posts',
				title: 'Post endpoint',
				description: 'Post description',
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

			if (this.endpoint.properties.length === 0) {
				if (!confirm('Creating an endpoint without any properties?\nAre you sure?')) {
					return;
				}
			}

			// TODO: Validation on submit
			const errors = this.validate();
			if (errors > 0) {
				return console.error('errors: ', this.errors);
			}

			const { propertiesObject, requiredProperties, propError } = this.createObjectFromPropsArray(this.endpoint.properties);
			if (propError) {
				this.errors.push(propError);
				return console.error('propError: ', propError);
			}
			console.log('propertiesObject', propertiesObject);
			console.log('requiredProperties', requiredProperties);
			console.log('propError', propError);
			console.log('this.errors', this.errors);

			const data = {
				name: this.endpoint.name,
				title: this.endpoint.title,
				description: this.endpoint.description,
				access: this.endpoint.access,
				properties: propertiesObject,
				required: requiredProperties,
				type: 'object'
			};

			console.log('data:', data);

			// // TODO: Validation
			// fetch(`${API_PATH}/endpoint`, {
			// 	method: 'POST',
			// 	headers: { 'Content-Type': 'application/json' },
			// 	body: JSON.stringify(data)
			// })
			// 	.then(res => res.json())
			// 	.then(res => {
			// 		const errMsgs = document.getElementById('error-messages')
			// 		const succMsgs = document.getElementById('success-messages')

			// 		if (res.success && res.record) {
			// 			console.log('res.record: ', res.record)
			// 			// TODO: Show success
			// 			errMsgs.innerHTML = ''
			// 			succMsgs.innerHTML = `<p class="success-message">Endpoint: <span class="highlighted">/${res.record.name}</span> created successfully.</p>`

			// 			// Dispatch created endpoint event
			// 			var event = new CustomEvent('endpoint-builder:created', {
			// 				detail: { endpoint: res.record, description: 'New endpoint created.' }
			// 			})
			// 			document.dispatchEvent(event)

			// 			// Reset Endpoint instance
			// 			endpointInstance.reset()
			// 			// Reset DOM
			// 			resetDOM(endpointInstance)
			// 		} else {
			// 			console.error(res)
			// 			// TODO: Show error
			// 			errMsgs.innerHTML = `<p class="error-message">${res.message}</p>`
			// 		}
			// 	})
		},

		addNewPropField() {
			// TODO: Add suport for adding custom number of props at once (Add property x 10)
			const newProperty = {
				error: null,
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

		createObjectFromPropsArray(arr) {
			let propError = null;
			let propertiesObject = {};
			const requiredProperties = [];

			for (const prop of arr) {
				// If prop already exist return propError
				if (propertiesObject[prop.name]) {
					propertiesObject = null;
					propError = { name: 'DuplicatePropertyName', message: `Property with this name already exist: ${prop.name}`, property: prop };
					break;
				} else {
					// If property is required add it to the required array
					if (prop.required) requiredProperties.push(prop.name);
					// Delete unnecessary fields
					delete prop.error;
					propertiesObject[prop.name] = prop;
				}
			}
			return { propertiesObject, requiredProperties, propError };
		},

		validate() {
			this.endpoint.properties.forEach((prop, index) => {
				if (prop.name === '') {
					const error = { name: 'EmptyPropertyName', message: `Property with index ${index + 1} has no name`, property: prop };
					const errAlreadyExist = this.errors.some((err) => err.message === error.message);
					if (!errAlreadyExist) {
						prop.error = error;
						this.errors.push(error);
					}
				}
			});
			return this.errors;
		},

		handleDeleteProperty(property) {
			this.endpoint.properties.forEach((prop, index) => {
				if (prop.id === property.id) {
					this.endpoint.properties.splice(index, 1);
				}
			});
		},

		handlePropNameChange(currentlyEditingProp) {
			const otherProperties = this.endpoint.properties.filter((prop) => prop.id !== currentlyEditingProp.id);
			// Check for duplicate property names
			otherProperties.forEach((prop) => {
				if (prop.name !== '' && prop.name === currentlyEditingProp.name) {
					// if (!errAlreadyExist) {
					// Show an error, add some styles
					const error = { name: 'DuplicatePropertyName', message: `Property with this name already exist: ${prop.name}`, property: currentlyEditingProp };
					this.errors.push(error);
					currentlyEditingProp.error = error;
					// }
				} else {
					this.errors.forEach((err, index) => {
						if (err.name === 'DuplicatePropertyName' && err.property.id === currentlyEditingProp.id) {
							this.errors.splice(index, 1);
							currentlyEditingProp.error = null;
						}
					});
				}
			});
		},

		scrollToProperty(error) {
			// Scroll to duplicate, apply some styles
			const el = document.querySelector(`li[data-id="${error.property.id}"]`);
			const heading = el.querySelector('.prop-heading');
			heading.classList.add('scrolled-to-error');
			setTimeout(() => {
				heading.classList.remove('scrolled-to-error');
			}, 1200);
			heading.scrollIntoView({ behavior: 'smooth', block: 'center' });
		},

		getRoles() {
			// TODO: Get roles from the API
			const options = [{ text: 'admin', value: 'admin' }, { text: 'user', value: 'user' }, { text: 'anon', value: 'anon' }];
			this.options.select.createRoles = options;
			this.options.select.readRoles = options;
			this.options.select.updateRoles = options;
			this.options.select.deleteRoles = options;
		}
	}
};
</script>

<style scoped lang="scss">
// TODO: Refactor CSS to SCSS

.endpoint-builder {
	scroll-behavior: smooth;

	fieldset.endpoint-properties {

		ul.endpoint-property-list {
			list-style: none;

			/deep/ .endpoint-property {
				border: 2px solid lightgray;
				border-radius: 10px;
			}

			/deep/ .endpoint-property:not(:first-child) {
				margin-top: 30px;
			}
		}
	}
}

/deep/ .helper-question-mark {
	width: 18px;
	height: 18px;
	border-radius: 50%;
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
	display: flex;
	align-items: flex-start;
	justify-content: space-between;
	margin-top: 15px;

	button {
		width: 70px;
		padding: 2px 5px;
		color: #fff;
		border: 1px solid #fff;
		background-color: transparent;
		border-radius: 5px;
		font-weight: 600;
		font-size: 13px;
		transition: all 200ms ease-in-out;
		&:hover {
			color: red;
			background-color: #fff;
			// text-decoration: underline;
		}
		&:focus {
			outline: none;
		}
		&:not(:last-child) {
			margin-right: 5px;
		}

		/deep/ .helper-question-mark {
			width: 100%;
			font-size: 13px;
			margin-left: 0;
			background-color: transparent;
			border-radius: initial;
			color: inherit;
			background-color: inherit;
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