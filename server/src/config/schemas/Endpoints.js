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
			"properties": {
				"name": { "title": "Endpoint name", "description": "Name of the endpoint name used in URLs", "type": "string" },
				"title": { "title": "Endpoint title", "description": "Descriptive endpoint title", "type": "string" },
				"description": { "title": "Endpoint description", "description": "Used to create dynamic endpoints", "type": "string" },
				"required": { "type": "array"},
				"properties": { "type": "object" },
				"type": { "type": "string", "const": "object" },
				"access": {
					"type": "object",
					"properties": {

						"create": {
							"type": "object",
							"properties": {
								"roles": {
									"type": "array",
									"items": {
										"type": "string",
										"enum": ["root", "admin", "user", "anon"]
									}
								}
							},
							"required": ["roles"]
						},

						"read": {
							"type": "object",
							"properties": {
								"roles": {
									"type": "array",
									"items": {
										"type": "string",
										"enum": ["root", "admin", "user", "anon"]
									}
								},
								"owner": {
									"type": "boolean"
								}
							},
							"required": ["roles", "owner"]
						},

						"update": {
							"type": "object",
							"properties": {
								"roles": {
									"type": "array",
									"items": {
										"type": "string",
										"enum": ["root", "admin", "user", "anon"]
									}
								},
								"owner": {
									"type": "boolean"
								}
							},
							"required": ["roles", "owner"]
						},

						"delete": {
							"type": "object",
							"properties": {
								"roles": {
									"type": "array",
									"items": {
										"type": "string",
										"enum": ["root", "admin", "user", "anon"]
									}
								},
								"owner": {
									"type": "boolean"
								}
							},
							"required": ["roles", "owner"]
						}
					},
					"required": ["create", "read", "update", "delete"]
				}
			},
			"type": "object" ,
			"required": ["name", "access", "properties"]
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
			"properties": {
				"username": { "title": "Username", "description": "Username used for logging in", "type": "string" },
				"password": { "title": "Password", "description": "User password", "type": "string" }
			},
			"type": "object" ,
			"required": ["username", "password"]
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
			"properties": {
				"userId": { "title": "User id", "description": "User reference for this record", "type": "string" },
				"password": { "title": "Password", "description": "Password hash", "type": "string" },
				"token": { "title": "Token", "description": "Authorization token", "type": "string" }
			},
			"type": "object" ,
			"required": ["userId", "password", "token"]
		}
	}
	
}