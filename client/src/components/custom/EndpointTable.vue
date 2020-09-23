<template>
	<div class="endpoint-table-component">
		<div class="table-sm table-hover table-striped">
			<table class="table">
				<thead class="thead-dark">
					<tr>
						<!-- TODO: Generate table from user properties -->
						<th scope="col">ID</th>
						<th scope="col">Name</th>
						<th scope="col" class="schema">Schema</th>
						<th scope="col" class="created">Created</th>
						<th scope="col" class="updated">Updated</th>
						<th scope="col">Owner</th>
						<th scope="col" class="operations">Operations</th>
					</tr>
				</thead>
				<tbody>
					<tr v-for="endpoint in endpoints" :key="endpoint.id">
						<th class="endpoint-id">{{ endpoint._id }}</th>
						<td>{{endpoint.name}}</td>
						<td class="schema">
							<button @click="viewSchema(endpoint)" class="btn">View</button>
						</td>
						<td class="created">{{endpoint.created}}</td>
						<td class="updated">{{endpoint.updated ? endpoint.updated : 'Never'}}</td>
						<td>{{endpoint.__owner}}</td>

						<!-- TODO: Implement edit functionality -->
						<!-- Dont load operations buttons for builtin endpoints -->
						<td class="operations">
							<button v-if="notBuiltinEndpoint(endpoint.name)" type="button" class="btn btn-outline-info" @click="editEndpoint(endpoint)">
								Edit
							</button>
							<button v-if="notBuiltinEndpoint(endpoint.name)" type="button" class="btn btn-outline-danger" @click="deleteEndpoint(endpoint)">
								Delete
							</button>
						</td>
					</tr>
				</tbody>
			</table>
		</div>

		<div ref="schemaModal" class="modal modal-hide">
			<div class="modal-content" name="modal-content"></div>
		</div>
	</div>
</template>

<script>
// Helpers
import { mapState, mapMutations } from 'vuex';

export default {
	name: 'EndpointTable',

	computed: {
		...mapState('endpoints', {
			endpoints: (state) => state.endpoints
		})
	},

	created() {
		this.getEndpoints();
	},

	methods: {
		...mapMutations('endpoints', {
			mutateEndpoints: 'SET_ENDPOINTS',
			mutateRemoveEndpoint: 'REMOVE_ENDPOINT'
		}),

		async getEndpoints() {
			try {
				const res = await this.$http.endpoint.getEndpoints();
				const endpoints = res.data;
				this.mutateEndpoints(endpoints);
				// console.log('endpoint res: ', res);
				return endpoints;
			} catch (err) {
				console.error(err);
			}
		},

		editEndpoint(endpoint) {
			event.stopPropagation();
			console.log('edit', endpoint);
		},

		async deleteEndpoint(endpoint) {
			event.stopPropagation();
			if (!confirm(`Are you sure you want to delete the endpoint named: ${endpoint.name}`)) return;

			try {
				const res = await this.$http.endpoint.delete(endpoint._id);
				this.mutateRemoveEndpoint(endpoint._id);
			} catch (err) {
				console.error(err);
			}
		},

		viewSchema(endpoint) {
			event.preventDefault();
			event.stopPropagation();
			const modal = this.$refs.schemaModal;
			modal.classList.add('modal-show');
			modal.children[0].innerHTML = `
				<h4 style="text-align: center;">${endpoint.name}</h4>
				<pre>${JSON.stringify(endpoint._schema, null, 4)}</pre>
			`;

			// Add close event listener
			document.addEventListener('click', (e) => {
				if (e.target.id === modal.id) {
					modal.children[0].innerHTML = '';
					// Close modal
					modal.classList.remove('modal-show');
				}
			});
		},

		notBuiltinEndpoint(endpointName) {
			return endpointName !== 'dashboard' && endpointName !== 'endpoint' && endpointName !== 'user' && endpointName !== 'login';
		}
	}
};
</script>

<style scoped lang="scss">
/*
 * Tables
 */
table {
	display: block;
	overflow-x: auto;
	width: 100%;
	font-family: Monospace;

	border-collapse: unset;
	border-spacing: 2px 10px;
 }

table thead .updated,
table thead .created {
	min-width: 180px;
}

table td,
table th {
	font-size: 14px;
	vertical-align: middle !important;
}

.table th,
.table td {
	min-width: 150px;
	border-top: none;
}

.table-hover tbody tr:hover {
	/* cursor: pointer; */
	color: #212529;
	background-color: rgba(0,0,0,.2);
}

table tbody .btn {
	padding: 5px 10px;
	font-size: 13px;
	/* border: none; */
	border-radius: 5px;
}
table tbody .btn:nth-child(1) {
	margin-right: 5px;
}

/* Table rows */
table tbody .created,
table tbody .updated,
table tbody .token {
	font-size: 12px;
}

table thead .schema,
table tbody .schema {
	max-width: fit-content;
	white-space: nowrap;
}
table tbody .schema button {
	color: #17a2b8;
	border: none;
}
table tbody .schema button:hover {
	background-color: transparent;
	text-decoration: underline;
	color: #17a2b8;
	filter: contrast(130%)
}

table tbody .operations {
	text-align: center;
}

table tbody .endpoint-id {
	cursor: pointer;
	&:hover {
		text-decoration: underline;
	}
}

/* Modals */
.modal-show {
	/* display: block; */
	visibility: visible !important;
  opacity: 1 !important;
}
/* Modal */
.modal {
	visibility: hidden;
	opacity: 0;
	display: block;
  position: fixed;
  z-index: 9999;
	left: 0;
	top: 0;
  width: 100%;
	height: 100%;
	padding: 2% 0;
  overflow-y: auto;
  background-color: rgb(0, 0, 0);
	background-color: rgba(0, 0, 0, 0.45);

	transition: visibility 0s, opacity 0.3s ease-in-out;
}

.modal .modal-content {
	width: 55%;
	margin: 0 auto;
	padding: 3% 4%;
	background-color: rgb(255,255,255);
}
</style>