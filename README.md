# e-commerce-server

**Base URL**

http://localhost:3000

**Deployment URL**

frontend:
backend:

# e-commerce-server

## **_Register_**

Returns new user.

- **URL**

  /register

- **Method:**

  `POST`

- **URL Params**

  None

- **Data Params**

  **Required:**

  ```
    {
      name: req.body.name
      email: req.body.email,
      password: req.body.password
    }
  ```

- **Success Response:**

  - **Code:** 201 <br />
    **Content:**

    ```
    {
        "success": true,
        "message": "user successfully created
    }
    ```

- **Error Response:**

  - **Code:** 400 <br />
    **Content:**
    ```
    { errors : "SequelizeValidationError" }
    ```

  OR

  - **Code:** 500 <br />
    **Content:**
    ```
    { errors : "Internal Server Error" }
    ```

- **Sample Call:**

  ```javascript
  axios({
  	method: "POST",
  	url: `http://localhost:3000/register`,
    headers: {
      "Content-Type": "application/json"
    }
  	data: {
      name,
  		email,
  		password,
  	},
  });
  ```

---

## **_Login_**

Returns access token.

- **URL**

  /login

- **Method:**

  `POST`

- **URL Params**

  None

- **Data Params**

  **Required:**

  ```
    {
      email: req.body.email,
      password: req.body.password
    }
  ```

- **Success Response:**

  - **Code:** 200 <br />
    **Content:**

    ```
    {
        "success": true,
        "access_token": <user access_token>
    }
    ```

- **Error Response:**

  - **Code:** 400 <br />
    **Content:**
    ```
    {
      "errors": [
          "Invalid email and password"
      ]
    }
    ```

  OR

  - **Code:** 500 <br />
    **Content:**
    ```
    { errors : "Internal Server Error" }
    ```

- **Sample Call:**

  ```javascript
  axios({
  	method: "POST",
  	url: `http://localhost:3000/login`,
    headers: {
      "Content-Type": "application/json"
    }
  	data: {
  		email,
  		password,
  	},
  });
  ```

---

## **_Add_**

Returns product.

- **URL**

  /products

- **Method:**

  `POST`

- **URL Params**

  None

- **Data Params**

  **Required:**

  ```
    {
      name: req.body.name,
      image_url: req.body.image_url,
      price: req.body.price,
      stock: req.body.stock,
      category: req.body.category,
      description: req.body.description,
    }
  ```

- **Success Response:**

  - **Code:** 201 <br />
    **Content:**

    ```
    {
      "sucess": true,
      "data": {
          "id": 1,
          "name": "<product name>",
          "image_url": "<product image_url>",
          "price": "<product price>",
          "stock": "<product stock>",
          "category": "<product category>",
          "description": "<product description>",
          "updatedAt": "2021-04-15T00:22:11.114Z",
          "createdAt": "2021-04-15T00:22:11.114Z",
      }
    }
    ```

- **Error Response:**

  - **Code:** 400 <br />
    **Content:**
    ```
    { errors : "SequelizeValidationError" }
    ```

  OR

  - **Code:** 500 <br />
    **Content:**
    ```
    { errors : "Internal Server Error" }
    ```

- **Sample Call:**

  ```javascript
  axios({
  	method: "POST",
  	url: `http://localhost:3000/products`,
  	headers: {
  		"Content-Type": "application/json",
  		access_token: localStorage.getItem("access_token"),
  	},
  	data: {
  		name,
  		image_url,
  		price,
  		stock,
  		category,
  		description,
  	},
  });
  ```

---

## **_Display All_**

Returns all products.

- **URL**

  /products

- **Method:**

  `GET`

- **URL Params**

None

- **Data Params**

  None

- **Success Response:**

  - **Code:** 200 <br />
    **Content:**
    ```
    {
      "success": true
      "products": [
        {
          "id": 1,
          "name": "<product name>",
          "image_url": "<product image_url>",
          "price": "<product price>",
          "stock": "<product stock>",
          "category": "<product category>",
          "description": "<product description>",
          "updatedAt": "2021-04-15T00:22:11.114Z",
          "createdAt": "2021-04-15T00:22:11.114Z",
        },
        {
          "id": 2,
          "name": "<product name>",
          "image_url": "<product image_url>",
          "price": "<product price>",
          "stock": "<product stock>",
          "category": "<product category>",
          "description": "<product description>",
          "updatedAt": "2021-04-15T00:22:11.114Z",
          "createdAt": "2021-04-15T00:22:11.114Z",
        }
      ]
    }
    ```

- **Error Response:**

  - **Code:** 500 <br />
    **Content:**
    ```
    { errors : "Internal Server Error" }
    ```

- **Sample Call:**

  ```javascript
  axios({
  	method: "GET",
  	url: "http://localhost:3000/products",
  	headers: {
  		access_token: localStorage.getItem("access_token"),
  	},
  });
  ```

---

## **_Display One_**

Returns one product.

- **URL**

  /products/:id

- **Method:**

  `GET`

- **URL Params**

id

- **Data Params**

  None

- **Success Response:**

  - **Code:** 200 <br />
    **Content:**
    ```
    {
      "success": true,
      "product": {
        "id": 1,
        "name": "<product name>",
        "image_url": "<product image_url>",
        "price": "<product price>",
        "stock": "<product stock>",
        "category": "<product category>",
        "description": "<product description>",
        "updatedAt": "2021-04-15T00:22:11.114Z",
        "createdAt": "2021-04-15T00:22:11.114Z",
      }
    }
    ```

- **Error Response:**

  - **Code:** 404 <br />
    **Content:**
    ```
    {
      "errors": [
          "Task Not Found"
      ]
    }
    ```

  OR

  - **Code:** 500 <br />
    **Content:**
    ```
    { errors : "Internal Server Error" }
    ```

- **Sample Call:**

  ```javascript
  axios({
  	method: "GET",
  	url: "http://localhost:3000/tasks/1",
  	headers: {
  		access_token: localStorage.getItem("access_token"),
  	},
  });
  ```

---

## **_Edit_**

Returns editted product.

- **URL**

  /tasks/:id

- **Method:**

  `PUT`

- **URL Params**

  id

- **Data Params**

  **Required:**

  ```
    {
      title: req.body.title,
      category: req.body.category,
    }
  ```

- **Success Response:**

  - **Code:** 201 <br />
    **Content:**
    ```
    {
      "success": true,
      "data": {
        "id": 1,
        "title": "<task title>",
        "category": "<task category>",
        "updatedAt": "2021-04-15T00:22:11.114Z",
        "createdAt": "2021-04-15T00:22:11.114Z",
        "UserId": <task UserId>
      }
    }
    ```

- **Error Response:**

  - **Code:** 400 <br />
    **Content:**

    ```
    { error : "SequelizeValidationError" }
    ```

    OR

  - **Code:** 404 <br />
    **Content:**

    ```
    {
      "errors": [
          "Product Not Found"
      ]
    }
    ```

    OR

  - **Code:** 400 <br />
    **Content:**

    ```
    {
        "errors": [
            "Missing Access Token"
        ]
    }
    ```

    OR

  - **Code:** 400 <br />
    **Content:**

    ```
    {
        "errors": [
            "Invalid Token"
        ]
    }
    ```

    OR

  - **Code:** 500 <br />
    **Content:**
    ```
    { errors : "Internal Server Error" }
    ```

- **Sample Call:**

  ```javascript
  axios({
  	method: "PUT",
  	url: `http://localhost:3000/products/1`,
  	headers: {
  		access_token: localStorage.getItem("access_token"),
  	},
  	data: {
  		name,
  		image_url,
  		price,
  		stock,
  		category,
  		description,
  	},
  });
  ```

---

## **_Delete_**

Returns status.

- **URL**

  /products/:id

- **Method:**

  `DELETE`

- **URL Params**

  id

- **Data Params**

  None

- **Success Response:**

  - **Code:** 201 <br />
    **Content:**
    ```
    {
      "success": true
      "message": "Product successfully deleted"
    }
    ```

- **Error Response:**

  - **Code:** 404 <br />
    **Content:**

    ```
    {
      "errors": [
          "Product Not Found"
      ]
    }
    ```

    OR

  - **Code:** 400 <br />
    **Content:**

    ```
    {
        "errors": [
            "Missing Access Token"
        ]
    }
    ```

    OR

  - **Code:** 400 <br />
    **Content:**

    ```
    {
        "errors": [
            "Invalid Token"
        ]
    }
    ```

    OR

  - **Code:** 500 <br />
    **Content:**
    ```
    { errors : "Internal Server Error" }
    ```

- **Sample Call:**

  ```javascript
  axios({
  	method: "DELETE",
  	url: `http://localhost:3000/products/1`,
  	headers: {
  		access_token: localStorage.getItem("access_token"),
  	},
  });
  ```
