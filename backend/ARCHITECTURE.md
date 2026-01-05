# Architecture Documentation

## Architecture Pattern: app-route-controller-service-repository

This backend follows a clean architecture pattern with clear separation of concerns.

## Layer Responsibilities

### 1. App Layer (`app/`)
- **Purpose**: Application entry point and Express.js setup
- **Responsibilities**:
  - Initialize Express application
  - Configure middleware (CORS, JSON parsing)
  - Connect to database
  - Register routes
  - Start server
  - Error handling

### 2. Routes Layer (`routes/`)
- **Purpose**: Define API endpoints and HTTP methods
- **Responsibilities**:
  - Map URLs to controllers
  - Apply middleware (validation, authentication)
  - Route organization

**Example:**
```typescript
router.post('/register', validate(registerSchema), authController.register);
```

### 3. Controllers Layer (`controllers/`)
- **Purpose**: Handle HTTP requests and responses
- **Responsibilities**:
  - Extract data from requests
  - Call service methods
  - Format responses
  - Handle errors

**Example:**
```typescript
register = async (req: Request, res: Response): Promise<void> => {
  const registerData: RegisterDTO = req.body;
  const result = await this.authService.register(registerData);
  res.status(201).json({ success: true, data: result });
}
```

### 4. Services Layer (`services/`)
- **Purpose**: Business logic implementation
- **Responsibilities**:
  - Business rules validation
  - Password hashing
  - JWT token generation
  - Data transformation
  - Call repositories

**Example:**
```typescript
async register(registerData: RegisterDTO) {
  // Check email uniqueness
  // Hash password
  // Create user
  // Generate token
}
```

### 5. Repositories Layer (`repositories/`)
- **Purpose**: Database operations abstraction
- **Responsibilities**:
  - CRUD operations
  - Database queries
  - Data persistence
  - No business logic

**Example:**
```typescript
async findByEmail(email: string): Promise<IUser | null> {
  return await User.findOne({ email });
}
```

## Data Flow

```
Request → Routes → Controllers → Services → Repositories → Database
                                                          ↓
Response ← Routes ← Controllers ← Services ← Repositories
```

## DTOs (Data Transfer Objects)

- **Location**: `dto/`
- **Purpose**: Validate and structure request/response data
- **Technology**: Zod schemas
- **Benefits**:
  - Type safety
  - Automatic validation
  - Clear API contracts

## Models

- **Location**: `models/`
- **Purpose**: Define database schemas
- **Technology**: Mongoose
- **Features**:
  - Type definitions
  - Validation rules
  - Indexes
  - Timestamps

## Middleware

- **Location**: `middleware/`
- **Purpose**: Reusable request processing functions
- **Examples**:
  - Validation middleware
  - Authentication middleware
  - Error handling middleware

## Benefits of This Architecture

1. **Separation of Concerns**: Each layer has a single responsibility
2. **Testability**: Easy to unit test each layer independently
3. **Maintainability**: Changes in one layer don't affect others
4. **Scalability**: Easy to add new features
5. **Reusability**: Services and repositories can be reused
6. **Type Safety**: TypeScript ensures type correctness

## Example Request Flow

### Register User Request

1. **Client** sends POST request to `/api/auth/register`
2. **Route** (`auth.routes.ts`) receives request
3. **Validation Middleware** validates request body against Zod schema
4. **Controller** (`auth.controller.ts`) extracts data and calls service
5. **Service** (`auth.service.ts`):
   - Checks if email exists (calls repository)
   - Hashes password
   - Creates user (calls repository)
   - Generates JWT token
6. **Repository** (`user.repository.ts`) performs database operations
7. **Response** flows back through layers to client

## File Structure

```
backend/
├── app/
│   └── index.ts                 # Express setup, server start
├── routes/
│   └── auth.routes.ts           # Auth endpoints
├── controllers/
│   └── auth.controller.ts       # Request/response handling
├── services/
│   └── auth.service.ts          # Business logic
├── repositories/
│   └── user.repository.ts       # Database operations
├── models/
│   └── User.ts                  # Mongoose schema
├── dto/
│   ├── register.dto.ts          # Register validation
│   └── login.dto.ts             # Login validation
├── config/
│   ├── database.ts              # MongoDB connection
│   └── env.ts                   # Environment config
└── middleware/
    └── validate.ts              # Zod validation middleware
```

