login- POST 
http://localhost:5000/api/v1/auth/login

{
  "email": "dinesh@test.com",
  "password": "123456"
}

GET - to check all orders
http://localhost:5000/api/v1/orders

GET -to check using the id
http://localhost:5000/api/v1/orders/1


http://localhost:5000/api/v1/payments/create-order

{
    "order_id": 4
}

GET 

http://localhost:5000/api/v1/payments/history