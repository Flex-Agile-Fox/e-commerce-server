# e-commerce-server

## Production
* Server : https://e-commerce-cms-server-hacktiv8.herokuapp.com
* Client CMS : https://e-commerce-client-hacktiv8.web.app
* Client Customer : https://customer-electronics-village.web.app

## Login Admin
* email: admin@mail.com
* password: admin

## Set Up
Buat folder .env kemudian copy dan paste semua isi pada file env.template<br/>
npm install
npm run test (untuk menggunakan jest)
npm run db:magic (untuk membuat database, table, sedders dan menjalankan nodemon)

## Base URL for server development
http://localhost:3000/


## INSTALL PACKAGE
* bcryptjs
* cors
* dotenv
* jsonwebtoken
* sequelize orm
* pg (database postgres)
* jest
* supertest
* google library

## End Points
* POST/register
* POST/login
* POST/google
* GET/product
* POST/product
* PUT/product/:id
* DELETE/product/:id
* GET/cart
* POST/cart
* PUT/cart/:id
* DELETE/cart/:id


## Register Users
Register User
* URL
```url
/register
```
* Method:
```method
POST
```
* URL Params
```params
None
```
* Data Body
    ```data
    Required:
    {
        name: req.body.name,
        email: req.body.email
        password: req.body.password
        role: req.body.role
    }
    ```
* Success Response:
    Code: 201
    ```res
    Content:
    {
        "success": true,
        "message": "User berhasil register"
    }
    ```
* Error Response:
    Code : 400
    ```err
    Content:
    {
        "success": false,
        "errorMessage": [
            "Validation error: Email tidak boleh kosong,",
            "Validation error: Format harus email. example: abc@gmail.com,"
        ]
    }
    ```
    - OR
    Code: 500
    ```or
    Content:
    {
        "success": false,
        "errorMessage": "Internal Server Error"
    }
    ```


## Login Users
Login User
* URL
```url
/login
```
* Method:
```method
POST
```
* URL Params
```params
None
```
* Data Body
    Required:
    ```data
    {
        name: req.body.name,
        email: req.body.email
    }
    ```
* Success Response:
    Code: 200
    ```res
    Content:
    {
        "success": true,
        "access_token": "<access token>"
    }
    ```
* Error Response:
    Code : 400
    ```err
    Content:
    {
        "success": false,
        "errorMessage": [
            "Validation error: Email tidak boleh kosong,",
            "Validation error: Format harus email. example: abc@gmail.com,"
        ]
    }
    ```
    - OR
    Code: 500
    ```or
    Content:
    {
        "success": false,
        "errorMessage": "Internal Server Error"
    }
    ```


## Add product
Menambahkan data product
* URL
```url
/products
```
* Method:
```url
POST
```
* Request Headers
```headers
access_token : <access token>
```
* URL Params
```params
None
```
* Data Body
    Required:
    ```data
    {
        name: req.body.name,
        image_url: req.body.image_url
        stock: req.body.stock
        price: req.body.price
    }
    ```
* Success Response:
    Code: 201
    ```response
    Content:
    {
        "success": true,
        "data": {
            "id": 1,
            "name": "<product name>",
            "image_url": "<product image_url>",
            "price": "<product price>",
            "stock": "<product stock>",
            "updatedAt": "2021-04-17T10:31:57.095Z",
            "createdAt": "2021-04-17T10:31:57.095Z"
        }
    }
    ```
* Error Response:
    Code : 400
    ```errResponse
    Content:
    {
        "success": false,
        "errorMessage": [
            "Validation error: Title tidak boleh kosong,",
            "Validation error: Title Minimal 3 karater,",
            "Validation error: Description tidak boleh kosong"
        ]
    }
    ```
    OR
    Code: 500
    ```or
    Content:
    {
        "success": false,
        "errorMessage": "Internal Server Error"
    }
    ```



## List product
Menampilkan semua data product
* URL
```url
/products
```
* Method:
```method
GET
```
* Request Headers
```headers
access_token : <access token>
```
* URL Params
```params
None
```
* Data Body
```data
None
```
* Success Response:
    Code: 200
    ```response
    Content:
    {
        "success": true,
        "data": [   
            {
               "id": 1,
                "name": "<product name>",
                "image_url": <product image_url>
                "price": "<product price>",
                "stock": "<product stock>",
                "createdAt": "2021-04-17T10:10:34.365Z",
                "updatedAt": "2021-04-17T10:10:34.365Z"
            },
            {
                "id": 2,
                "name": "<product name>",
                "image_url": <product image_url>
                "price": "<product price>",
                "stock": "<product stock>",
                "createdAt": "2021-04-17T10:10:34.365Z",
                "updatedAt": "2021-04-17T10:10:34.365Z"
            },
        ]
    }
    ```
* Error Response:
    Code: 500
    ```err
    Content
    {
        "success": false,
        "errorMessage": "Internal Server Error"
    }
    ```



## Update Product
Mengupdate semua field pada data product
* URL
```url
/product/:id
```
* Method:
```method
PUT
```
* Request Headers
```headers
access_token : <access token>
```
* URL Params
```params
id
```
* Data Body
    ```data
    Required: 
    {
        name: req.body.name,
        image_url: req.body.image_url
        stock: req.body.stock
        price: req.body.price
    }
    ```
* Success Response:
    Code: 200
    ```res
    Content:
    {
        "success": true,
        "data": {
            "id": 3,
            "name": "<product name>",
            "image_url": <product image_url>
            "price": "<product price>",
            "stock": "<product stock>",
            "createdAt": "2021-04-13T14:04:12.464Z",
            "updatedAt": "2021-04-13T15:31:37.907Z"
        }
    }
    ```
    - OR
    Code: 404
    ```err
    Content:
    {
        "success": false,
        "errorMessage": "Data tidak ditemukan"
    }
    ```
* Error Response:
    Code: 500
    Content:
    {
        "success": false,
        "errorMessage": "Internal Server Error"
    }
    ```



# Delete Product
Menghapus data Product
* URL
```url
/product/:id
```
* Method:
```delete
DELETE
```
* Request Headers
```headers
access_token : <access token>
```
* URL Params
```params
id
```
* Data Params
```data
None
```
* Success Response:
    Code: 200
    Content:
    {message:"product Success Delete"}
    ```
    - OR
    Code: 404
    ```err
    Content
    {
        "success": false,
        "errorMessage": "Data tidak ditemukan"
    }
    ```
* Error Response:
    Code: 500
    ```err
    Content:
    {
        "success": false,
        "errorMessage": "Internal Server Error"
    }
    ```



## Add Cart
Menambahkan data Cart
* URL
```url
/cart
```
* Method:
```url
POST
```
* Request Headers
```headers
access_token : <access token>
```
* URL Params
```params
None
```
* Data Body
    Required:
    ```data
    {
        "UserId": 2,
        "ProductId": 1,
        "qty": 1,
        "price": 1000
    }
    ```
* Success Response:
    Code: 201
    ```response
    Content:
    {
        "success": true,
        "data": {
            "id": 1,
            "UserId": "<Cart UserId>",
            "ProductId": "<Cart ProductId>",
            "qty": "<Cart qty>",
            "price": "<Cart price>",
            "updatedAt": "2021-04-17T10:31:57.095Z",
            "createdAt": "2021-04-17T10:31:57.095Z"
        }
    }
    ```
* Error Response:
    Code: 500
    ```or
    Content:
    {
        "success": false,
        "errorMessage": "Internal Server Error"
    }
    ```


## Get cart
Menampilkan semua data cart
* URL
```url
/cart
```
* Method:
```method
GET
```
* Request Headers
```headers
access_token : <access token>
```
* URL Params
```params
None
```
* Data Body
```data
None
```
* Success Response:
    Code: 200
    ```response
    Content:
    {
        "success": true,
        "data": [   
            {
               "id": 1,
                "UserId": "<UserId>",
                "ProductId": <UserId>
                "qty": "<cart qty>",
                "price": "<cart price>",
                "createdAt": "2021-04-17T10:10:34.365Z",
                "updatedAt": "2021-04-17T10:10:34.365Z"
            },
            {
               "id": 2,
                "UserId": "<UserId>",
                "ProductId": <UserId>
                "qty": "<cart qty>",
                "price": "<cart price>",
                "createdAt": "2021-04-17T10:10:34.365Z",
                "updatedAt": "2021-04-17T10:10:34.365Z"
            },
        ]
    }
    ```
* Error Response:
    Code: 500
    ```err
    Content
    {
        "success": false,
        "errorMessage": "Internal Server Error"
    }
    ```


## Update cart
Mengupdate semua field pada data cart
* URL
```url
/cart/:id
```
* Method:
```method
PUT
```
* Request Headers
```headers
access_token : <access token>
```
* URL Params
```params
id
```
* Data Body
    ```data
    Required: 
    {
        "UserId": 2,
        "ProductId": 1,
        "qty": 1,
        "price": 1000
    }
    ```
* Success Response:
    Code: 201
    ```response
    Content:
    {
        "success": true,
        "data": {
            "id": 1,
            "UserId": "<Cart UserId>",
            "ProductId": "<Cart ProductId>",
            "qty": "<Cart qty>",
            "price": "<Cart price>",
            "updatedAt": "2021-04-17T10:31:57.095Z",
            "createdAt": "2021-04-17T10:31:57.095Z"
        }
    }
    ```
    - OR
    Code: 404
    ```err
    Content:
    {
        "success": false,
        "errorMessage": "Data tidak ditemukan"
    }
    ```
* Error Response:
    Code: 500
    Content:
    {
        "success": false,
        "errorMessage": "Internal Server Error"
    }
    ```



# Delete cart
Menghapus data cart
* URL
```url
/cart/:id
```
* Method:
```delete
DELETE
```
* Request Headers
```headers
access_token : <access token>
```
* URL Params
```params
id
```
* Data Params
```data
None
```
* Success Response:
    Code: 200
    Content:
    {message:"cart Success Delete"}
    ```
    - OR
    Code: 404
    ```err
    Content
    {
        "success": false,
        "errorMessage": "Data tidak ditemukan"
    }
    ```
* Error Response:
    Code: 500
    ```err
    Content:
    {
        "success": false,
        "errorMessage": "Internal Server Error"
    }
    ```