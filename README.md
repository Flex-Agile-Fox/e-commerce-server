# Kanban Board

## Getting Started

- After clone from github, please do `npm install` from your terminal editor.

  Example:

  ```
  C:\Users\okihu\hacktiv8\phase-2\e-commerce-server> npm install
  ```

- After that create `.env` file on root folder. Copy the template variable on `.env-template` into `.env`, and fill the related credential for each variable.

- Please check script on package.json first before using any script. You can use it as it is if using windows machine, but if not (linux, Mac, etc) change "SET NODE_ENV=test/development&&" into "NODE_ENV=test/development"

- Setup database(development env) by typing `npm run setup` from your terminal editor.

  Example:

  ```
  C:\Users\okihu\hacktiv8\phase-2\e-commerce-server> npm run setup
  ```

- Finally type `npm run dev` on the terminal editor to run the server.

  Example:

  ```
  C:\Users\okihu\hacktiv8\phase-2\e-commerce-server> npm run dev
  ```

=====================================================================================

## User Endpoint

- ### User Register | `POST /users/register`

  - _Method_
    ```
    POST
    ```
  - _URL_
    ```
    users/register
    ```
  - _URL Params_
    ```
    none
    ```
  - _Data Params_
    ```json
    {
    	"name": "req.body.name",
    	"email": "req.body.email",
    	"password": "req.body.password",
    	"role": "req.body.role"
    }
    ```
  - _Success Response_ **_Code 201_**

    ```json
    {
    	"access_token": "access_token",
    	"user": {
    		"id": "user.id",
    		"name": "user.name",
    		"email": "user.email",
    		"password": "user.password",
    		"role": "user.role",
    		"createdAt": "user.createdAt",
    		"updatedAt": "user.updatedAt"
    	}
    }
    ```

  - _Error Response_ **_Code 400_**

    Occurs if user leave the text field empty or not pass the validation

    ```json
    {
    	"message": [
    		"please input your name",
    		"name at least must be 3 characters",
    		"please input your mail address",
    		"please input valid mail address",
    		"please input your password",
    		"password at least must be 6 characters",
    		"role must not be empty"
    	]
    }
    ```

  - _Error Response_ **_Code 409_**

    Occurs if email has been used or existed in database

    ```json
    {
    	"message": ["email has been used"]
    }
    ```

  - _Error Response_ **_Code 500_**

    Occurs if there is any error code on server

    ```json
    {
    	"message": ["internal server error"]
    }
    ```

- ### User Login | `POST /users/login`

  - _Method_
    ```
    POST
    ```
  - _URL_
    ```
    users/login
    ```
  - _URL Params_
    ```
    none
    ```
  - _Data Params_
    ```json
    {
    	"email": "req.body.email",
    	"password": "req.body.password"
    }
    ```
  - _Success Response_ **_Code 200_**

    ```json
    {
    	"access_token": "access_token",
    	"user": {
    		"id": "user.id",
    		"name": "user.name",
    		"email": "user.email",
    		"password": "user.password",
    		"role": "user.role",
    		"createdAt": "user.createdAt",
    		"updatedAt": "user.updatedAt"
    	}
    }
    ```

  - _Error Response_ **_Code 401_**

    Occurs if there is any empty value or email/password not match

    ```json
    {
    	"message": ["wrong email or password"]
    }
    ```

  - _Error Response_ **_Code 500_**

    Occurs if there is any error code on server

    ```json
    {
    	"message": ["internal server error"]
    }
    ```

=====================================================================================

## Product Endpoint

- ### Create Product | `POST /products`

  - _Method_
    ```
    POST
    ```
  - _URL_
    ```
    /products
    ```
  - _URL Params_
    ```
    none
    ```
  - _Data Params_

    ```json
    {
    	"name": "req.body.name",
    	"image_url": "req.body.image_url",
    	"price": "req.body.price",
    	"stock": "req.body.stock",
    	"category": "req.body.category"
    }
    ```

  - _Success Response_ **_Code 200_**

    ```json
    {
    	"access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Miwicm9sZSI6ImN1c3RvbWVyIiwiaWF0IjoxNjIyODE0ODE2fQ.mtKRqy3UWFmmZFDJnO_AIcffIf9EnSSY8xWYntWgA-A",
    	"user": {
    		"id": 2,
    		"name": "customer",
    		"email": "customer@mail.com",
    		"password": "$2a$08$PiopwXfH/G81cO7XKVabE.hMb8NGbgXwEivgT1GZiAGc3qJKakECS",
    		"role": "customer",
    		"updatedAt": "2021-06-04T13:53:35.428Z",
    		"createdAt": "2021-06-04T13:53:35.428Z"
    	}
    }
    ```

  - _Error Response_ **_Code 400_**

    Occurs if access_token is not authorized

    ```json
    {
    	"message": ["only admin that authorized"]
    }
    ```

  - _Error Response_ **_Code 401_**

    Occurs if access_token is not generated or not passed

    ```json
    {
    	"message": ["missing access token"]
    }
    ```

  - _Error Response_ **_Code 400_**

    Occurs if there is any empty value

    ```json
    {
    	"message": [
    		"product name cannot be empty string",
    		"product image url must not be empty string",
    		"price must not be null",
    		"stock must not be null",
    		"product category must not be empty string"
    	]
    }
    ```

  - _Error Response_ **_Code 500_**

    Occurs if there is any error code on server

    ```json
    {
    	"message": ["internal server error"]
    }
    ```

- ### Get All Products | `GET /products`

  - _Method_
    ```
    GET
    ```
  - _URL_
    ```
    /products
    ```
  - _URL Params_
    ```
    none
    ```
  - _Data Params_

    ```
    none
    ```

  - _Success Response_ **_Code 200_**

    ```json
    {
    	"data": [
    		{
    			"id": 1,
    			"name": "Sepatu",
    			"image_url": "google.com/Sepatu.jpg",
    			"price": 490000,
    			"stock": 5,
    			"category": "Sport",
    			"createdAt": "2021-06-04T14:00:10.818Z",
    			"updatedAt": "2021-06-04T14:00:10.818Z"
    		},
    		{
    			"id": 2,
    			"name": "Sepatu1",
    			"image_url": "google.com/Sepatu1.jpg",
    			"price": 500000,
    			"stock": 4,
    			"category": "Sport",
    			"createdAt": "2021-06-04T14:00:27.625Z",
    			"updatedAt": "2021-06-04T14:00:27.625Z"
    		}
    	]
    }
    ```

  - _Error Response_ **_Code 401_**

    Occurs if access_token is not generated or not passed

    ```json
    {
    	"message": ["missing access token"]
    }
    ```

  - _Error Response_ **_Code 500_**

    Occurs if there is any error code on server

    ```json
    {
    	"message": ["internal server error"]
    }
    ```

- ### Get All Products | `GET /products/:id`

  - _Method_
    ```
    GET
    ```
  - _URL_
    ```
    /products/:id
    ```
  - _URL Params_
    ```
    id
    ```
  - _Data Params_

    ```
    none
    ```

  - _Success Response_ **_Code 200_**

    ```json
    {
    	"data": {
    		"id": 2,
    		"name": "Sepatu1",
    		"image_url": "google.com/Sepatu1.jpg",
    		"price": 500000,
    		"stock": 4,
    		"category": "Sport",
    		"createdAt": "2021-06-04T14:00:27.625Z",
    		"updatedAt": "2021-06-04T14:00:27.625Z"
    	}
    }
    ```

  - _Error Response_ **_Code 401_**

    Occurs if access_token is not generated or not passed

    ```json
    {
    	"message": ["missing access token"]
    }
    ```

  - _Error Response_ **_Code 500_**

    Occurs if there is any error code on server

    ```json
    {
    	"message": ["internal server error"]
    }
    ```

- ### Edit Products by Id | `PUT /products/:id`

  - _Method_
    ```
    PUT
    ```
  - _URL_
    ```
    /products/:id
    ```
  - _URL Params_
    ```
    id
    ```
  - _Data Params_

    ```json
    {
    	"name": "sandal swallow",
    	"image_url": "http://sandal",
    	"price": 17000,
    	"stock": 3,
    	"category": "kids"
    }
    ```

  - _Success Response_ **_Code 200_**

    ```json
    {
    	"data": {
    		"id": 2,
    		"name": "sandal swallow",
    		"image_url": "http://sandal",
    		"price": 17000,
    		"stock": 3,
    		"category": "kids",
    		"createdAt": "req.body.createdAt",
    		"updatedAt": "req.body.updatedAt"
    	}
    }
    ```

  - _Error Response_ **_Code 400_**

    Occurs if there is any empty value

    ```json
    {
    	"message": [
    		"product name cannot be empty string",
    		"product image url must not be empty string",
    		"price must not be null",
    		"stock must not be null",
    		"product category must not be empty string"
    	]
    }
    ```

  - _Error Response_ **_Code 400_**

    Occurs if access_token is not authorized

    ```json
    {
    	"message": ["only admin that authorized"]
    }
    ```

  - _Error Response_ **_Code 401_**

    Occurs if access_token is not generated or not passed

    ```json
    {
    	"message": ["missing access token"]
    }
    ```

  - _Error Response_ **_Code 500_**

    Occurs if there is any error code on server

    ```json
    {
    	"message": ["internal server error"]
    }
    ```

- ### Delete Products by Id | `DELETE /products/:id`

  - _Method_
    ```
    DELETE
    ```
  - _URL_
    ```
    /products/:id
    ```
  - _URL Params_
    ```
    id
    ```
  - _Data Params_

    ```
    none
    ```

  - _Success Response_ **_Code 200_**

    ```json
    {
    	"message": "product has been deleted"
    }
    ```

  - _Error Response_ **_Code 400_**

    Occurs if access_token is not authorized

    ```json
    {
    	"message": ["only admin that authorized"]
    }
    ```

  - _Error Response_ **_Code 401_**

    Occurs if access_token is not generated or not passed

    ```json
    {
    	"message": ["missing access token"]
    }
    ```

  - _Error Response_ **_Code 500_**

    Occurs if there is any error code on server

    ```json
    {
    	"message": ["internal server error"]
    }
    ```
