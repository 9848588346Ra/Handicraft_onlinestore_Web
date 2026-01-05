# MongoDB Atlas Connection Setup

## Connection String

Your MongoDB Atlas connection string has been configured:

```
mongodb+srv://mongouser:fRYDZsMX865QogNM@cluster0.gasn0ua.mongodb.net/handicraft_store?retryWrites=true&w=majority
```

## Setup Instructions

### Option 1: Create .env file (Recommended)

Create a `.env` file in the `backend` directory with the following content:

```env
PORT=3000
MONGODB_URI=mongodb+srv://mongouser:fRYDZsMX865QogNM@cluster0.gasn0ua.mongodb.net/handicraft_store?retryWrites=true&w=majority
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d
NODE_ENV=development
```

### Option 2: Use Default Configuration

The connection string is already set as the default in `config/env.ts`, so it will work without a `.env` file.

## Database Name

The database name is: **handicraft_store**

## Viewing Registered Users in MongoDB

### Method 1: MongoDB Atlas Web Interface

1. Go to [MongoDB Atlas](https://cloud.mongodb.com/)
2. Log in with your credentials
3. Click on your cluster: **cluster0**
4. Click **Browse Collections**
5. Select database: **handicraft_store**
6. Select collection: **users**
7. You'll see all registered users with their data

### Method 2: MongoDB Compass

1. Download [MongoDB Compass](https://www.mongodb.com/products/compass)
2. Connect using the connection string:
   ```
   mongodb+srv://mongouser:fRYDZsMX865QogNM@cluster0.gasn0ua.mongodb.net/handicraft_store
   ```
3. Navigate to **handicraft_store** → **users** collection
4. View all registered users

### Method 3: Using MongoDB Shell (mongosh)

```bash
# Connect to your cluster
mongosh "mongodb+srv://mongouser:fRYDZsMX865QogNM@cluster0.gasn0ua.mongodb.net/handicraft_store"

# Switch to database
use handicraft_store

# View all users
db.users.find().pretty()

# Count users
db.users.countDocuments()

# Find specific user by email
db.users.findOne({ email: "john@example.com" })
```

## User Document Structure

When you register a user, the document in MongoDB will look like:

```json
{
  "_id": ObjectId("..."),
  "name": "John Doe",
  "email": "john@example.com",
  "password": "$2a$10$hashedpassword...",
  "role": "user",
  "createdAt": ISODate("2025-01-05T12:00:00.000Z"),
  "updatedAt": ISODate("2025-01-05T12:00:00.000Z"),
  "__v": 0
}
```

## Testing the Connection

1. Start your backend server:
   ```bash
   cd backend
   npm run dev
   ```

2. You should see:
   ```
   ✅ MongoDB connected successfully
   📊 Database: handicraft_store
   🚀 Server is running on http://localhost:3000
   ```

3. Register a user using Postman

4. Check MongoDB Atlas to see the new user in the **users** collection

## Troubleshooting

### Connection Error
- Make sure your IP address is whitelisted in MongoDB Atlas
- Go to Network Access in MongoDB Atlas and add your IP (or 0.0.0.0/0 for all IPs)

### Authentication Error
- Verify the username and password in the connection string
- Check if the database user has proper permissions

### Database Not Found
- The database will be created automatically when you insert the first document
- Make sure the connection string includes the database name: `/handicraft_store`

## Security Note

⚠️ **Important**: The connection string contains your password. Keep it secure:
- Never commit `.env` file to Git
- Use environment variables in production
- Rotate passwords regularly

