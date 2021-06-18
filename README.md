# Kanban Board

Available endpoint:

- User
- Product
- Cart
- Search

## Getting Started

- After clone from github, please do `npm install` from your terminal editor.

  Example:

  ```
  C:\Users\okihu\hacktiv8\phase-2\e-commerce-server> npm install
  ```

- Create `.env` file on root folder. Copy the template variable on `.env-template` into `.env`, and fill the related credential for each variable.

- Please check script on package.json first before using any command script. You can use it as it is if using windows machine, but if not (linux, Mac, etc) change "SET NODE_ENV=test" or "SET NODE_ENV=development&&" into "NODE_ENV=test" or "NODE_ENV=development"

- Setup database(development env) by typing `npm run setup` from your terminal editor.

- Setup database(test env) by typing `npm run setup:test` from your terminal editor.

- Run jest test by `npm run test`

  Example:

  ```
  C:\Users\okihu\hacktiv8\phase-2\e-commerce-server> npm run setup
  ```

- Finally type `npm run dev` on the terminal editor to run the server.

  Example:

  ```
  C:\Users\okihu\hacktiv8\phase-2\e-commerce-server> npm run dev
  ```

Link server side Heroku: https://cms-admin-dashboard.herokuapp.com

Link admin client side Firebase: https://cms-admin-dashboard.web.app

# Link customer client: https://agileshoee-24e66.web.app

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
        "role": "customer"
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
          "category": "Sport"
        },
        {
          "id": 2,
          "name": "Sepatu1",
          "image_url": "google.com/Sepatu1.jpg",
          "price": 500000,
          "stock": 4,
          "category": "Sport"
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
        "category": "Sport"
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
        "category": "kids"
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

=====================================================================================

## Cart Endpoint

- ### Add Product to Cart | `POST /carts/:productId`

  - _Method_
    ```
    POST
    ```
  - _URL_
    ```
    /carts/:productId
    ```
  - _URL Params_
    ```
    productId
    ```
  - _Data Params_

    ```
    none
    ```

  - _Success Response_ **_Code 200_**

    ```json
    {
      "data": {
        "id": 4,
        "userId": 2,
        "productId": 2,
        "qty": 1,
        "updatedAt": "2021-06-15T22:58:00.747Z",
        "createdAt": "2021-06-15T22:58:00.747Z"
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

  - _Error Response_ **_Code 400_**

    Occurs when productId not found

    ```json
    {
      "message": ["product not found"]
    }
    ```

  - _Error Response_ **_Code 400_**

    Occurs when adding product exceed the stock

    ```json
    {
      "message": ["quantity exceed stock"]
    }
    ```

  - _Error Response_ **_Code 500_**

    Occurs if there is any error code on server

    ```json
    {
      "message": ["internal server error"]
    }
    ```

- ### Get all product added to Cart | `GET /carts`

  - _Method_
    ```
    GET
    ```
  - _URL_
    ```
    /carts
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
          "userId": 2,
          "productId": 1,
          "qty": 1,
          "createdAt": "2021-06-15T05:54:24.808Z",
          "updatedAt": "2021-06-15T22:41:13.234Z",
          "Product": {
            "id": 1,
            "name": "Ando",
            "image_url": "https://cf.shopee.co.id/file/8154fd3b4cb3bff2b67d8bf7503f503c",
            "price": 190000,
            "stock": 8,
            "category": "Formal",
            "createdAt": "2021-06-15T05:52:29.721Z",
            "updatedAt": "2021-06-15T05:52:29.721Z"
          }
        }
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

- ### Increase qty product in Cart by 1 | `PUT /carts/increase/:id`

  - _Method_
    ```
    PUT
    ```
  - _URL_
    ```
    /carts/increase/:id
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
        "id": 3,
        "userId": 2,
        "productId": 3,
        "qty": 2, // qty increased by 1 each request
        "createdAt": "2021-06-15T22:54:32.393Z",
        "updatedAt": "2021-06-16T02:25:37.152Z"
      }
    }
    ```

  - _Error Response_ **_Code 400_**

    Occurs if request qty exceed stock product

    ```json
    {
      "message": ["quantity exceed stock"]
    }
    ```

  - _Error Response_ **_Code 400_**

    Occurs if product not found in cart

    ```json
    {
      "message": ["product not found in the cart"]
    }
    ```

  - _Error Response_ **_Code 400_**

    Occurs if cart not found

    ```json
    {
      "message": ["cart not found"]
    }
    ```

  - _Error Response_ **_Code 500_**

    Occurs if there is any error code on server

    ```json
    {
      "message": ["internal server error"]
    }
    ```

- ### Decrease qty product in Cart by 1 | `PUT /carts/decrease/:id`

  - _Method_
    ```
    PUT
    ```
  - _URL_
    ```
    /carts/decrease/:id
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
        "id": 3,
        "userId": 2,
        "productId": 3,
        "qty": 2, // qty decreased by 1 each request
        "createdAt": "2021-06-15T22:54:32.393Z",
        "updatedAt": "2021-06-16T02:25:37.152Z"
      }
    }
    ```

  - _Error Response_ **_Code 400_**

    Occurs when request qty exceed minimum qty

    ```json
    {
      "message": ["cannot exceed minimum quantity"]
    }
    ```

  - _Error Response_ **_Code 400_**

    Occurs if cart not found

    ```json
    {
      "message": ["cart not found"]
    }
    ```

  - _Error Response_ **_Code 500_**

    Occurs if there is any error code on server

    ```json
    {
      "message": ["internal server error"]
    }
    ```

- ### Delete cart by id | `DELETE /carts/:id`

  - _Method_
    ```
    PUT
    ```
  - _URL_
    ```
    /carts/decrease/:id
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
      "message": "product has been removed from cart"
    }
    ```

  - _Error Response_ **_Code 400_**

    Occurs if cart not found

    ```json
    {
      "message": ["cart not found"]
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

## Search Endpoint

- ### Get all product searched by name | `GET /search`

  - _Method_
    ```
    GET
    ```
  - _URL_
    ```
    /search
    ```
  - _URL Params_
    ```
    /search?name=query
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
          "id": 2,
          "name": "Bata",
          "image_url": "https://cf.shopee.co.id/file/8154fd3b4cb3bff2b67d8bf7503f503c",
          "price": 120000,
          "stock": 7,
          "category": "Casual",
          "createdAt": "2021-06-15T05:52:44.466Z",
          "updatedAt": "2021-06-15T05:52:44.466Z"
        }
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
