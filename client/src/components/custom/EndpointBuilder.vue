<template>
<div id="endpoint-builder" class="endpoint-builder">
	<h3>Endpoint builder</h3>
	<form onsubmit="onSubmit()" class="endpoint-form">
		<div class="form-group">
			<label for="name">Name</label>
			<input type="text" class="form-control" id="endpoint-name">
			<small class="form-text text-muted">Name of your endpoint, used in URL-s, e.g. <strong>posts</strong></small>
		</div>
		<div class="form-group">
			<label for="title">Title</label>
			<input type="text" class="form-control" id="endpoint-title">
			<small class="form-text text-muted">Descriptive title for the endpoint, e.g. <strong>Post endpoint</strong></small>
		</div>
		<div class="form-group">
			<label for="description">Description</label>
			<textarea type="text" class="form-control" id="endpoint-description"></textarea>
		</div>
		<div class="form-group access-group">
			<fieldset>
				<h4>Access <span class="required">*</span></h4>
				<small class="form-text text-muted">Define access to CRUD for user roles and record owner. Role <strong>root</strong> has access to all operations by default.</small>

				<div class="form-group">
					<label for="endpoint-access-create"><strong>Create:</strong></label>
					<select id="endpoint-access-create" class="custom-select" multiple>

					</select>
				</div>

				<div class="form-group">
					<label for="endpoint-access-read"><strong>Read:</strong></label>
					<select id="endpoint-access-read" class="custom-select" multiple>
					</select>
					<div class="form-check">
						<input type="checkbox" checked class="form-check-input" id="endpoint-access-read-owner">
						<label class="form-check-label" for="endpoint-access-read-owner">Owner only</label>
					</div>
				</div>

				<div class="form-group">
					<label for="endpoint-access-update"><strong>Update:</strong></label>
					<select id="endpoint-access-update" class="custom-select" multiple>

					</select>
					<div class="form-check">
						<input type="checkbox" checked class="form-check-input" id="endpoint-access-update-owner">
						<label class="form-check-label" for="endpoint-access-read-owner">Owner only</label>
					</div>
				</div>

				<div class="form-group">
					<label for="endpoint-access-delete"><strong>Delete:</strong></label>
					<select id="endpoint-access-delete" class="custom-select" multiple>
					</select>
					<div class="form-check">
						<input type="checkbox" checked class="form-check-input" id="endpoint-access-delete-owner">
						<label class="form-check-label" for="endpoint-access-read-owner">Owner only</label>
					</div>
				</div>
			</fieldset>
		</div>
		<div class="form-group">
			<h4>Properties:</h4>
			<hr>
			<ul id="properties">

			</ul>
			<button onclick="addNewPropField()" type="button" class="btn btn-primary">Add property</button>
		</div>
		<div class="form-group">
			<div id="error-messages"></div>
			<div id="success-messages"></div>
		</div>

		<div class="form-group">
			<button type="submit" class="btn btn-success create-endpoint-btn">
				<svg class="feather"><use xlink:href="icons/feather/feather-sprite.svg#aperture"/></svg>
				Create endpoint
			</button>
		</div>
	</form>
</div>
</template>

<script>
export default {
	name: 'EndpointBuilder'
};
</script>

<style scoped lang="scss">
li.single-property {
	max-width: 500px;
	margin-left: 25px;
	/* margin: 0 auto; */
}

li.single-property h5 {
	padding: 5px 10px;
	border-radius: 5px;
	transition: background-color 500ms ease-in-out,
							color 500ms ease-in-out;
}
li.single-property h5.duplicate-error {
	color: #fff;
	background-color: red;
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

li.single-property select {
	overflow: auto;
}
li.single-property select option {
	font-size: 13px;
}

li.single-property .relation-group div {
	/* margin-left: 15px; */
}

form.endpoint-form .create-endpoint-btn .feather {
	position: relative;
	bottom: 2px;
	margin-right: 5px;
}

#error-messages .error-message {
	color: #fff;
	background-color:#ee4545;
	padding: 10px 15px;
	border-radius: 5px;
}

#success-messages .success-message {
	color: #fff;
	background-color: #35d535;
	padding: 10px 15px;
	border-radius: 5px;
}
#success-messages .success-message .highlighted {
	font-weight: 600;
}
</style>