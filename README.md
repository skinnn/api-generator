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
			"replace": {
				"username": "skinnn",
				"roles": ["user"],
				"firstName": "John",
				"lastName": "Doe",
				"country": "Serbia",
				"city": "Belgrade",
				"postalCode": 11000,
				"address": "Street address...",
				"suiteNumber": 101,
				"phone": "381654289534",
				"description": "User description...",
				"stripeCustomer": "cus_HEpHRrw71Gkjn8",
				"password": "$2b$10$RqheOQv2O19zufH7AV2rk.kteCqXK7k5zvPYXt9ndKKHnCrI3//M6",
				"email": "skinnn1@gmail.com",
				
				"billingInfo.firstName": "John2",
				"billingInfo.lastName": "Doe",
				"billingInfo.company": "Company 2",
				"billingInfo.city": "Chicago",
				"billingInfo.state": "Illinois",
				"billingInfo.country": "USA",
				"billingInfo.postalCode": 11000,
				"billingInfo.address": "Some st. 123",
				"billingInfo.suiteNumber": 123,
				"billingInfo.phone": "+1231233123",
				"billingInfo.email": "skinnn@example.com",
			
				"shippingInfo.firstName": "John2",
				"shippingInfo.lastName": "Doe",
				"shippingInfo.company": "Company 2",
				"shippingInfo.city": "Chicago",
				"shippingInfo.state": "Illinois",
				"shippingInfo.country": "USA",
				"shippingInfo.postalCode": 11000,
				"shippingInfo.address": "Some st. 123",
				"shippingInfo.suiteNumber": 123
			}
			```
		+	**DELETE**
		Example: http://localhost:8090/api/user/:id

	+ #### **/login**
	
	+ #### **/transaction**