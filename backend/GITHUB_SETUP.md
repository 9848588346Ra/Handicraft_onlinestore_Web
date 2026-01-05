# GitHub Setup Instructions

## Creating a Branch for Submission

Since this is a monorepo (backend and frontend in the same repository), follow these steps:

### Option 1: Create a new branch named "sprint-1"

```bash
# Make sure you're in the project root
cd "c:\softwarica workhub\Albert sir\Handicraft_Onlinestore_Web"

# Check current branch
git status

# Create and switch to new branch
git checkout -b sprint-1

# Add all backend files
git add backend/

# Commit the changes
git commit -m "feat: Add user authentication API with app-route-controller-service-repository architecture

- Implemented user registration with email uniqueness validation
- Implemented user login with password verification
- Added password hashing using bcryptjs
- Added JWT token generation
- Created Zod DTOs for request validation
- Added role-based user model (user/admin)
- Followed clean architecture pattern"

# Push to remote repository
git push origin sprint-1
```

### Option 2: Create a branch with feature name

```bash
git checkout -b feature/user-authentication-api
git add backend/
git commit -m "feat: Add user authentication API"
git push origin feature/user-authentication-api
```

## Commit History Best Practices

Make meaningful commits:

```bash
# Initial commit for backend structure
git add backend/package.json backend/tsconfig.json
git commit -m "chore: Set up backend project structure"

# Models and DTOs
git add backend/models/ backend/dto/
git commit -m "feat: Add User model and validation DTOs"

# Repository layer
git add backend/repositories/
git commit -m "feat: Implement user repository layer"

# Service layer
git add backend/services/
git commit -m "feat: Implement authentication service with password hashing and JWT"

# Controller and routes
git add backend/controllers/ backend/routes/
git commit -m "feat: Implement auth controller and routes"

# App setup and configuration
git add backend/app/ backend/config/ backend/middleware/
git commit -m "feat: Set up Express app with middleware and database connection"

# Documentation
git add backend/README.md backend/SETUP.md backend/ARCHITECTURE.md
git commit -m "docs: Add comprehensive documentation"
```

## Repository Structure

Your repository should look like this:

```
Handicraft_Onlinestore_Web/
├── backend/                    # Backend API
│   ├── app/
│   ├── routes/
│   ├── controllers/
│   ├── services/
│   ├── repositories/
│   ├── models/
│   ├── dto/
│   ├── config/
│   ├── middleware/
│   ├── package.json
│   ├── tsconfig.json
│   └── README.md
├── src/                        # Frontend React app
├── screens/                    # Frontend screens
├── package.json               # Frontend package.json
└── README.md
```

## Making Repository Public

If your repository needs to be public:

1. Go to your GitHub repository settings
2. Scroll down to "Danger Zone"
3. Click "Change visibility"
4. Select "Make public"

## Submission Checklist

- [ ] Backend code follows app-route-controller-service-repository architecture
- [ ] User model includes role field (user/admin)
- [ ] DTOs implemented with Zod validation
- [ ] Password hashing implemented
- [ ] JWT token generation implemented
- [ ] Email uniqueness validation implemented
- [ ] All endpoints tested with Postman
- [ ] Documentation included (README, SETUP, ARCHITECTURE)
- [ ] Branch created (sprint-1 or feature-name)
- [ ] Code committed and pushed to GitHub
- [ ] Postman video recorded (2-5 minutes)

## Postman Video Requirements

Your video should demonstrate:

1. **User Registration:**
   - Valid registration request
   - Validation error (invalid email)
   - Validation error (password mismatch)
   - Email already exists error

2. **User Login:**
   - Valid login request
   - Invalid credentials error
   - Validation error (invalid email format)

3. **Show Response Details:**
   - Success responses with user data and token
   - Error responses with validation messages
   - HTTP status codes

