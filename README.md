## E-Commerce template  

###### Template for creating a basic e-commerce store.

+ #### Frontend  
	+ **Technologies**:
		+ Vue.js

+ #### Backend  
	+ **Technologies**:
		+ Node
		+ Express
		+ MongoDB
	+ **REST API** - [Documentation](#api-documentation)
	+ **Token based authentication** (JWT)
	+ **Roles** (root, admin, user)
	+ **Integrated payment systems** (Paypal, Stripe)
	+ **Stripe customers**

# API Documentation
##### Client: http://localhost:8080
##### API: http://localhost:8090/api

+ #### Endpoints:
	+ #### **/user**
		+	**POST**
		Example: http://localhost:8090/api/user
		```Content-Type: application/json```
		Body:
			```json
			{
				"username": "user1",
				"password": "123123",
				"email": "user1@gmail.com",
				"firstName": "John",
				"lastName": "Doe",
				"country": "USA",
				"city": "Los Angeles",
				"postalCode": 90000,
				"address": "Street address...",
				"suiteNumber": 213,
				"phone": "+12138885555",
				"stripeCustomer": "",
				"description": "User description...",
				"billingInfo": {
					"firstName": "John",
					"lastName": "Doe",
					"company": "Company name",
					"city": "Los Angeles",
					"state": "",
					"country": "USA",
					"postalCode": 90000,
					"phone": "+12138885555",
					"email": "test@gmail.com",
					"address": "Some st. 123",
					"suiteNumber": 333
				},
				"shippingInfo": {
					"firstName": "John",
					"lastName": "Doe",
					"company": "Company name",
					"state": "Illinois",
					"city": "Chicago",
					"country": "USA",
					"postalCode": 90000,
					"address": "Some st. 123",
					"suiteNumber": 123
				}
			}
			```
		+	**GET** 
		Example: http://localhost:8090/api/user
		Example: http://localhost:8090/api/user/:id
		+	**PATCH**
		Example: http://localhost:8090/api/user/:id
		```Content-Type: application/json```
		Body:
			```json
			{
				"fields": {
					"username": "test username update"
				}
			}
			```
		+	**DELETE**
		Example: http://localhost:8090/api/user/:id

	+ #### **/login**
	
	+ #### **/transaction**