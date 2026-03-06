# Handicraft Online Store

E-commerce web application for handicraft products.

## Project Structure (Clean Architecture)

```
Handicraft_Onlinestore_Web/
├── Frontend/         # Next.js frontend (App Router)
│   ├── src/
│   │   ├── app/      # Pages, layout, globals
│   │   ├── components/ # Reusable components
│   │   ├── context/  # App state (auth, cart)
│   │   ├── services/ # API client
│   │   ├── shared/   # Schemas, types, data
│   │   └── styles/   # Page CSS
│   ├── public/       # Static assets (images)
│   └── ...
├── backend/          # Express + MongoDB backend
│   ├── app/          # Entry point
│   ├── config/       # Env, database
│   ├── controllers/  # HTTP handlers
│   ├── services/     # Business logic
│   ├── repositories/ # Data access
│   ├── models/       # Mongoose schemas
│   ├── routes/       # Route definitions
│   ├── middleware/   # Auth, validation
│   ├── dto/          # Validation schemas
│   └── scripts/      # Seed
└── package.json      # Root scripts
```

## Quick Start

```bash
# Install all dependencies
npm run install:all

# Start backend (port 3000)
npm run dev:backend

# Start frontend (port 3001)
npm run dev:frontend
```

## Environment

**Backend** (`.env` in backend/): `PORT`, `MONGODB_URI`, `JWT_SECRET`, `NODE_ENV`

**Frontend** (`.env.local` in Frontend/): `NEXT_PUBLIC_API_URL` (default: http://localhost:3000)
