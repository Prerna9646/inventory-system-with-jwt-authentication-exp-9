#  Inventory Management System (Spring Boot + React + JWT)

A full-stack **Inventory & Stock Management System** built using **Spring Boot (Backend)** and **React.js (Frontend)** with **JWT Authentication** and **Role-Based Access Control (ADMIN & USER)**.

---

#  Project Structure
```
Inventory-Management-System/
│
├── backend/
│ ├── controller/
│ ├── service/
│ ├── repository/
│ ├── model/
│ ├── security/
│
├── frontend/
  ├── src/
  | ├── components/
  | ├── services/
  | ├── context/
  |
  ├── App.js
  ├── App.cs
```
#  Features

##  Authentication & Security
- User Registration & Login
- JWT-based Authentication
- Refresh Token Mechanism
- Role-Based Authorization (ADMIN / USER)
- Secure Password Storage using BCrypt

##  Product Management
- Add New Product
- View All Products
- View My Products
- Update Product
- Delete Product
- Pagination Support

##  User Management (Admin Only)
- View All Users
- Update User
- Delete User
- Role-Based Access Control

##  Backend Features
- RESTful APIs
- Global Exception Handling
- DTO-based Architecture
- JPA/Hibernate Relationships
- Database Seeding (Sample Data)

##  Frontend Features
- Responsive UI
- Protected Routes
- Axios Interceptors (JWT handling)
- Token Auto Refresh
- Role-Based UI Rendering

---

#  Tech Stack

## Backend
- Spring Boot
- Spring Security
- JWT (JSON Web Token)
- Hibernate / JPA
- MySQL / H2

## Frontend
- React.js
- Axios
- React Router
- Context API

---

#  Screenshots

##  Authentication

### Login Page
<img width="1366" height="682" alt="image" src="https://github.com/user-attachments/assets/4e2c23bd-92c3-4dee-aa65-a4584e8ef557" />


### Register Page 
<img width="1349" height="674" alt="image" src="https://github.com/user-attachments/assets/a3bb1ffc-64de-4dad-a4df-f1d0c75bb85a" />



### Dashboard After Login
<img width="1366" height="679" alt="image" src="https://github.com/user-attachments/assets/bb9b002c-a5dc-4eb0-8ac5-ceb8edaa763a" />

---

##  Product Management

### All Products View
<img width="1366" height="679" alt="image" src="https://github.com/user-attachments/assets/8c3fb036-f4ec-4375-b77e-597e6f7002c1" />


### My Products View
<img width="1366" height="675" alt="image" src="https://github.com/user-attachments/assets/2816ca75-da21-4b88-864a-a7e471ad99a8" />


### Add Product
<img width="1352" height="682" alt="image" src="https://github.com/user-attachments/assets/04f171f7-0f26-4e5c-8332-3b3c98f0e142" />


### Update Product
<img width="1366" height="679" alt="image" src="https://github.com/user-attachments/assets/b48311ed-94eb-4de2-9a9c-94213684d9a8" />


---

##  User Management (Admin)

### View All Users
<img width="1366" height="683" alt="image" src="https://github.com/user-attachments/assets/7eccf5f4-3203-4fcf-b85b-2c3fe5f094b0" />



### Delete User
 <img width="1366" height="673" alt="image" src="https://github.com/user-attachments/assets/2c5822f1-1279-4d1c-adec-86c8d1f2195d" />
 
---
<img width="1366" height="686" alt="image" src="https://github.com/user-attachments/assets/6f39f2c7-93db-47a4-9e7e-19a42500e01b" />


---

##  Error Handling

### Invalid Login
<img width="1366" height="687" alt="image" src="https://github.com/user-attachments/assets/9a76f8c9-48e8-427d-813e-f609c0e9281a" />

### Unauthorized Access
<img width="1366" height="680" alt="image" src="https://github.com/user-attachments/assets/4d288ad7-7321-4052-89ee-8a2ff4d4177e" />


---

#  Test Cases

| Module | Test Case | Expected Result | Status |
|--------|----------|----------------|--------|
| Auth | Login with valid credentials | Success + Token |  Pass |
| Auth | Login with wrong password | Error message |  Pass |
| Auth | Register new user | User created |  Pass |
| Product | Add product | Product saved |  Pass |
| Product | View all products | Product list displayed |  Pass |
| Product | View my products | Only user products |  Pass |
| Product | Update own product | Updated successfully | Pass |
| Product | Delete own product | Deleted |  Pass |
| Product | Delete others product (USER) | Forbidden |  Pass |
| Product | Delete any product (ADMIN) | Success |  Pass |
| User | View all users (ADMIN) | Success |  Pass |
| User | USER accessing admin APIs | Forbidden |  Pass |
| Security | API without token | Unauthorized |  Pass |

---

## Author

Prerna | 23BCS80341
