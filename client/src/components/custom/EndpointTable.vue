<template>
	<div class="users">
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
						<th scope="col" class="operation">Operation</th>
					</tr>
				</thead>
				<tbody>
					<tr v-for="endpoint in endpoints" :key="endpoint.id">
						<th class="id">{{ endpoint._id }}</th>
						<td>{{endpoint.name}}</td>
						<td class="schema" style="text-align: center;">
							<button onclick="viewSchema()" class="btn">View</button>
						</td>
						<td class="created">{{endpoint.created}}</td>
						<td class="updated">{{endpoint.updated ? endpoint.updated : 'Never'}}</td>
						<td>{{endpoint.__owner}}</td>

						<!-- TODO: Implement edit functionality -->
						<!-- Dont load operations buttons for builtin endpoints -->
						<td v-if="notBuiltinEndpoint(endpoint.name)" class="operation">
							<button type="button" class="btn btn-outline-info" :data-id="endpoint._id" @click="editEndpoint()">Edit</button>
							<button type="button" class="btn btn-outline-danger" :data-id="endpoint._id" @click="deleteEndpoint()">Delete</button>
						</td>
					</tr>
				</tbody>
			</table>
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
			mutateEndpoints: 'SET_ENDPOINTS'
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

		editEndpoint() {
			console.log('edit');
		},

		deleteEndpoint() {
			console.log('delete');
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

table tbody .operation {
	text-align: center;
}

table tbody .id {
	cursor: pointer;
}
</style>