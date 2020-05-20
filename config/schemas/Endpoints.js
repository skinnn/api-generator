module.exports = {
	endpoint: {
		"name": "endpoint",
		"_schema": {
			"name": "endpoint",
			"title": "Endpoint",
			"description": "Endpoint builder",
			"access": {
				"create": {
					"roles": ["root", "admin"]
				},
				"read": {
					"roles": ["root", "admin"],
					"owner": true
				},
				"update": {
					"roles": ["root", "admin"],
					"owner": true
				},
				"delete": {
					"roles": ["root", "admin"],
					"owner": true
				}
			},
			"properties": {},
			"type": "object" ,
			"required": []
		}
	},
	
	dashboard: {
		"name": "dashboard",
		"_schema": {
			"name": "dashboard",
			"title": "Dashboard",
			"description": "API administration dashboard",
			"access": {
				"create": {
					"roles": ["root", "admin"]
				},
				"read": {
					"roles": ["root", "admin"],
					"owner": true
				},
				"update": {
					"roles": ["root", "admin"],
					"owner": true
				},
				"delete": {
					"roles": ["root", "admin"],
					"owner": true
				}
			},
			"properties": {},
			"type": "object" ,
			"required": []
		}
	},

	user: {
		"name": "user",
		"_schema": {
			"name": "user",
			"title": "User endpoint",
			"description": "Endpoint for user resource",
			"access": {
				"create": {
					"roles": ["root", "admin", "anon"]
				},
				"read": {
					"roles": ["root", "admin", "user"],
					"owner": true
				},
				"update": {
					"roles": ["root", "admin", "user"],
					"owner": true
				},
				"delete": {
					"roles": ["root", "admin", "user"],
					"owner": true
				}
			},
			"properties": {},
			"type": "object" ,
			"required": []
		}
	},

	login: {
		"name": "login",
		"_schema": {
			"name": "login",
			"title": "Login endpoint",
			"description": "Endpoint for login resource",
			"access": {
				"create": {
					"roles": ["root", "admin", "user", "anon"]
				},
				"read": {
					"roles": ["root", "admin", "user"],
					"owner": true
				},
				"update": {
					"roles": ["root", "admin"],
					"owner": true
				},
				"delete": {
					"roles": ["root", "admin", "user"],
					"owner": true
				}
			},
			"properties": {},
			"type": "object" ,
			"required": []
		}
	},

	transaction: {
		"name": "transaction",
		"_schema": {
			"name": "transaction",
			"title": "Transaction endpoint",
			"description": "Endpoint for transaction resource",
			"access": {
				"create": {
					"roles": ["root", "admin", "user"]
				},
				"read": {
					"roles": ["root", "admin", "user"],
					"owner": true
				},
				"update": {
					"roles": ["root", "admin", "user"],
					"owner": false
				},
				"delete": {
					"roles": ["root", "admin", "user"],
					"owner": false
				}
			},
			"properties": {},
			"type": "object" ,
			"required": []
		}
	}
}