## REST API Generator <sup><sub>*Inspired by Lederata*</sub></sup>

An open source, customizable, and performant platform built on a modern Node.js technology stack. It gives you the power of designing and creating REST APIs without needing to code everything from the scratch.

Out of the box, it provides users, user roles, authentication, login records and admin panel.

Consume the API from any client (Vue, React, Angular, etc.), mobile apps or even IoT devices, using REST.

### Description

+ **Technologies**: [Node](https://nodejs.org/), [Express](https://expressjs.com/)
+ **Database**: [MongoDB](https://www.mongodb.com/)
+ [REST API Documentation](#api-documentation)
+ **Token based authorization** with [JSON Web Token](https://jwt.io/)
+ **Roles & permissions**

### Installation
1. Install [Node.js](https://nodejs.org/en/) and [MongoDB](https://www.mongodb.com/download)  
2. Clone this repository  
3. Install dependencies with `npm install` form the **root** directory 
4. Start:
	+ Development mode: `npm run dev`
	+ Production mode: `npm start`
5. Open application on http://localhost:8090
	+ API URL: http://localhost:8090/api
	

|*|Notes |
|-|-|
|`Login`| When app starts, if no `root` account is found in the system, one will be created by using `rootUser` section from [config.js](/config/config.js) file.|
|`Databases`| Current app version *v1* is working only with MongoDB, but database abstraction layer will be implemented|

### Authorization
Application is based on tokens, using **JSON Web Token** open standard [RFC 7519](https://tools.ietf.org/html/rfc7519) method for securely transmitting information between parties as a JSON object.
All endpoints going through `/api/*` route (e.g. http://localhost:8090/api/test) are going through authentication middleware.

### Roles
During first app initialization, `root` account will be created by using `rootUser` credentials from [config.js](/config/config.js) file.
Each REST API endpoint can have different roles for Creating, Reading, Modifying or Deleting a record.
>**root** &mdash; can access all endpoints and operations, used to define access permissions for all other roles; `admin`, `user`, `anon`. There can be only one root user in the system. Can not be created, deleted or modified by anyone. 
>**admin** &mdash; can access administration dashboard and other endpoints & operations defined by the `root `.
>**user** &mdash; can access endpoints & operations defined by the `admin` or `root`.
>**anon** (anonymous) &mdash; can access endpoints & operations defined by the `admin` or `root`. Anons are considered users which are not registered in the application. For example, a user visiting a blog or login page.

For example, take a look at this access configuration for an imaginary **/post** endpoint:
```
"access":{
	"create":{
		"roles": ["root", "admin", "user]
	},
	"update":{ 
		"roles": ["root", "admin", "user"],
		"owner": true
	},
	"read": {
		"roles": ["root", "admin", "user", "anon"],
		"owner": false
	},
	"delete":{
		"roles": ["root", "admin", "user"],
		"owner": true
	}
}
```
**Note**: Role `root` always has access to everything by default, so it will be disregarded in the explanation below.

Example above means:
- `admins` and `users` can create the post records
- `admins` and `users` are able to update posts, but only the ones they created
- `admins`, `users` and `anons` can read all the posts from the database
- `admins` and `users` can delete their own posts

# API Documentation
#### Administration dashboard:
+ /api/dashboard - API Generator GUI

+ #### Built-in REST Endpoints:
	+ #### **/user**
		+	**POST**
		URL: http://localhost:8090/api/users  
		```Content-Type: application/json```  
		Body:
			```json
			{
				"username": "jdoe",
				"password": "strongpassword123",
				"email": "jdoe@example.com",
				"firstName": "John",
				"lastName": "Doe",
				"description": "User description..."
			}
			```
		+	**GET**   
		URL: http://localhost:8090/api/users - Returns all users for `admin` and `root` roles
		URL: http://localhost:8090/api/users/:id
		+	**PATCH**  
		URL: http://localhost:8090/api/users/:id  
		```Content-Type: application/json```  
		Body:
			```json
			{
				"username": "jdoe_updated",
				"password": "strongestpassword123",
				"email": "jdoe@example.com",
				"firstName": "John",
				"lastName": "Malkovich",
				"description": "User description..."
			}
			```
		+	**DELETE**
		URL: http://localhost:8090/api/user/:id

	+ #### **/login**