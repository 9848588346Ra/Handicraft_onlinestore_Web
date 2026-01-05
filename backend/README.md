# Handicraft Online Store - Backend API

User Authentication API built with Express.js, TypeScript, MongoDB, and following the clean architecture pattern.

## Architecture

This project follows the **app-route-controller-service-repository** architecture pattern:

```
backend/
├── app/              # Application entry point
├── routes/           # Route definitions
├── controllers/      # Request/Response handling
├── services/         # Business logic (password hashing, JWT)
├── repositories/     # Database operations
├── models/           # Mongoose schemas
├── dto/              # Data Transfer Objects (Zod validation)
├── config/           # Configuration files
└── middleware/       # Express middleware
```

## Features

- ✅ User Registration with email uniqueness validation
- ✅ User Login with password verification
- ✅ Password hashing using bcryptjs
- ✅ JWT token generation
- ✅ Zod DTO validation
- ✅ Role-based user model (user/admin)
- ✅ Clean architecture pattern
- ✅ TypeScript support
- ✅ MongoDB integration with Mongoose

## Prerequisites

- Node.js (v18 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

## Installation

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the backend directory:
```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/handicraft_store
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d
NODE_ENV=development
```

3. Make sure MongoDB is running (or use MongoDB Atlas connection string)

## Running the Application

### Development Mode
```bash
npm run dev
```

### Production Mode
```bash
npm run build
npm start
```

The server will start on `http://localhost:3000`

## API Endpoints

### Health Check
- **GET** `/health` - Check if server is running

### Authentication

#### Register User
- **POST** `/api/auth/register`
- **Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "confirmPassword": "password123"
}
```
- **Success Response (201):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "...",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "user",
      "createdAt": "..."
    },
    "token": "jwt-token-here"
  }
}
```

#### Login User
- **POST** `/api/auth/login`
- **Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```
- **Success Response (200):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "...",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "user",
      "createdAt": "..."
    },
    "token": "jwt-token-here"
  }
}
```

## Testing with Postman

1. Import the following requests:

### Register Request
- Method: POST
- URL: `http://localhost:3000/api/auth/register`
- Headers: `Content-Type: application/json`
- Body (raw JSON):
```json
{
  "name": "Test User",
  "email": "test@example.com",
  "password": "password123",
  "confirmPassword": "password123"
}
```

### Login Request
- Method: POST
- URL: `http://localhost:3000/api/auth/login`
- Headers: `Content-Type: application/json`
- Body (raw JSON):
```json
{
  "email": "test@example.com",
  "password": "password123"
}
```

## Validation Errors

The API returns validation errors in the following format:

```json
{
  "success": false,
  "message": "Validation error",
  "errors": [
    {
      "field": "email",
      "message": "Please provide a valid email address"
    }
  ]
}
```

## User Model

The User model includes:
- `name`: String (required, 2-50 characters)
- `email`: String (required, unique, valid email format)
- `password`: String (required, min 6 characters, hashed)
- `role`: String (enum: 'user' | 'admin', default: 'user')
- `createdAt`: Date (auto-generated)
- `updatedAt`: Date (auto-generated)

## Security Features

- Passwords are hashed using bcryptjs before storage
- JWT tokens for authentication
- Email uniqueness validation
- Input validation using Zod schemas
- Password not returned in API responses

## Project Structure

```
backend/
├── app/
│   └── index.ts              # Express app setup
├── routes/
│   └── auth.routes.ts        # Auth routes
├── controllers/
│   └── auth.controller.ts    # Auth controllers
├── services/
│   └── auth.service.ts       # Business logic
├── repositories/
│   └── user.repository.ts    # Database operations
├── models/
│   └── User.ts               # User Mongoose model
├── dto/
│   ├── register.dto.ts       # Register DTO
│   └── login.dto.ts          # Login DTO
├── config/
│   ├── database.ts           # MongoDB connection
│   └── env.ts                # Environment config
├── middleware/
│   └── validate.ts            # Zod validation middleware
├── package.json
├── tsconfig.json
└── README.md
```

## License

MIT

