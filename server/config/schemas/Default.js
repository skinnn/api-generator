module.exports = {
	dashboard: {
		"resource": "dashboard",
		"access": {
			"create": {
				"roles": ["root", "admin"]
			},
			"read": {
				"roles": ["root", "admin"],
				"owner": false
			},
			"update": {
				"roles": ["root", "admin"],
				"owner": false
			},
			"delete": {
				"roles": ["root", "admin"],
				"owner": false
			}
		}
	},

	user: {
		"resource": "user",
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
		}
	},

	schema: {
		"resource": "schema",
		"access": {
			"create": {
				"roles": ["root", "admin"]
			},
			"read": {
				"roles": ["root", "admin", "user", "anon"],
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
		}
	},

	login: {
		"resource": "login",
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
		}
	},

	transaction: {
		"resource": "transaction",
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
		}
	}
}