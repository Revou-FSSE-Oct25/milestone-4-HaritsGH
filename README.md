# RevoBank

A backend service for RevoBank using NestJS and Prisma.
Deployment: https://abundant-insight-production-bb10.up.railway.app

## Endpoints

Not require authentication:

**Auth**

- POST /auth/register - Register a new user
- POST /auth/login - Login a user


Require authentication:

**User**

- GET /user/profile - Get user profile
- PUT /user/profile - Update user profile

**Account**

- GET /accounts - Get all accounts
- GET /accounts/:generatedId - Get a specific account details
- POST /accounts - Create a new account
- PATCH /accounts/:generatedId - Update account balance
- DELETE /accounts/:generatedId - Delete account

**Transaction**
- GET /transactions - Get all transactions
- GET /transactions/:id - Get transaction by ID
- POST /transactions/deposit - Create a new deposit transaction
- POST /transactions/withdraw - Create a new withdraw transaction
- POST /transactions/transfer - Create a new transfer transaction

## Features

- User authentication (register, login)
- Transactions from/to and between accounts
- Balance checking
- Multiple accounts per user
- Transaction history
- Profile management

## Tech Stack

- NestJS
- Prisma
- PostgreSQL
- TypeScript
- JWT
- Bcrypt
- Swagger
- Jest