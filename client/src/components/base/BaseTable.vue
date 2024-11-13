<template>
	<div class="base-table-component">
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
						<th scope="col roles">Roles</th>
						<th scope="col" class="operations">Operations</th>
					</tr>
				</thead>
				<tbody>
					<tr v-for="endpoint in endpoints" :key="endpoint.id">
						<th class="endpoint-id" @click="handleViewEndpoint(endpoint)">{{ endpoint._id }}</th>
						<td>{{endpoint.name}}</td>
						<td class="schema">
							<button @click="handleViewSchema(endpoint)" class="btn">View</button>
						</td>
						<td class="created">{{ endpoint.created}}</td>
						<td class="updated">{{ endpoint.updated ? endpoint.updated : 'Never' }}</td>
						<td>{{ endpoint.__owner }}</td>
						<td class="roles"><EndpointRoles :endpoint="endpoint" /></td>

						<!-- TODO: Implement edit functionality -->
						<!-- Dont load operations buttons for builtin endpoints -->
						<td class="operations">
							<button v-if="!isDefaultEndpoint(endpoint.name)" type="button" class="btn btn-outline-info" @click="editEndpoint(endpoint)">
								Edit
							</button>
							<button v-if="!isDefaultEndpoint(endpoint.name)" type="button" class="btn btn-outline-danger" @click="deleteEndpoint(endpoint)">
								Delete
							</button>
						</td>
					</tr>
				</tbody>
			</table>
		</div>

		<BaseModal v-if="!!endpoint" :show="true" @closeModal="handleCloseSchemaModal">
			<h4 style="text-align: center;">Schema: {{endpoint.name}}</h4>
			<a style="text-align: center;" :href="`${this.$config.api.base_url}/${endpoint.name}?token=${this.$store.state.user.token}`" target="_blank">
        {{`${this.$config.api.base_url}/${endpoint.name}`}}
      </a>
			<pre>{{JSON.stringify(endpoint._schema, null, 4)}}</pre>
		</BaseModal>
	</div>
</template>

<script>
// Helpers
import { mapState, mapMutations } from 'vuex';
// Components
import EndpointRoles from '@/components/custom/EndpointRoles.vue';
import BaseModal from '@/components/base/BaseModal.vue';

export default {
	name: 'BaseTable',
	components: { BaseModal, EndpointRoles },
	props: {
		endpoints: {
			type: Array,
			default: () => []
		}
	},
	computed: {
		// ...mapState('endpoints', {
		// 	endpoints: (state) => state.endpoints
		// })
	},

	data() {
		return {
			endpoint: null,
			showSchemaModal: false
		};
	},

	created() {},

	methods: {
		...mapMutations('endpoints', {
			mutateEndpoints: 'SET_ENDPOINTS',
			mutateRemoveEndpoint: 'REMOVE_ENDPOINT'
		}),

		editEndpoint(endpoint) {
			console.log('edit', endpoint);
		},

		async deleteEndpoint(endpoint) {
			if (!confirm(`Are you sure you want to delete the endpoint named: ${endpoint.name}`)) return;

			try {
				await this.$http.endpoint.delete(endpoint._id);
				this.mutateRemoveEndpoint(endpoint._id);
			} catch (err) {
				console.error(err);
			}
		},

		handleViewSchema(endpoint) {
			this.endpoint = endpoint;
		},

		handleCloseSchemaModal() {
			this.endpoint = null;
		},

		handleViewEndpoint(endpoint) {
			this.$router.push({
				name: 'view-endpoint',
				params: { id: endpoint._id }
			});
		},

		isDefaultEndpoint(endpointName) {
			return endpointName === 'dashboard' || endpointName === 'endpoint' || endpointName === 'user' || endpointName === 'session';
		}
	}
};
</script>

<style scoped lang="scss">
table {
	display: block;
	overflow-x: auto;
	width: 100%;
	font-family: Monospace;
	border-collapse: unset;
	border-spacing: 2px 10px;
 }

table td,
table th {
	font-size: 14px;
	vertical-align: middle;
	padding: 5px 10px;
}

.table th,
.table td {
	min-width: 50px;
	border: none;
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
table tbody .updated {
	font-style: italic;
	font-size: 12px;
}

table thead .schema,
table tbody .schema {
	max-width: fit-content;
	white-space: nowrap;
}
table tbody .schema button {
	background-color: transparent;
	color: #17a2b8;
	border: none;
}
table tbody .schema button:hover {
	background-color: transparent;
	text-decoration: underline;
	color: #17a2b8;
	filter: contrast(130%)
}

table thead .schema,
table tbody .schema,
table thead .roles,
table tbody .roles {
	min-width: 50px;
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
</style>
